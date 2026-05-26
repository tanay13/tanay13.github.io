export const blogPost = {
  title: 'Building Raven: Notes from Writing a Chess Engine',
  date: '2026-05-26',
  author: 'Tanay Raj',
  content: `
<!--<h2>The Motivation</h2>-->
<p>I love chess and have spent so many hours playing it online, and building a chess engine was one of those projects I kept postponing for years. Last year I finally created the repository, opened a blank file, and started working on it.</p>
<p>I wanted to build something real where a lot of the algorithms and concepts I had studied actually had to work together inside a single system. As the engine grew, the project naturally expanded into things like search, board representation, move generation, memory layout, and performance tradeoffs.</p>

<p>This article is not a code walkthrough but just a personal learning log, a record of the ideas, implementation decisions, mistakes, and things I understood better while building a chess engine.</p>
<div class="sep">♟</div>

<h2>The Initial Plan</h2>

<p>My brain went straight into system design interview mode. Boxes, arrows, entities, relationships. I identified all the objects: <code>Board</code>, <code>Piece</code>, <code>Move</code>, <code>Player</code>. I listed their methods. I sketched an inheritance hierarchy. Pawn extends Piece, Knight extends Piece, you know the drill. It felt clean and right.</p>

<p>The plan was simple, represent the board as a 2D array of piece objects, write minimax, then improve it with alpha-beta pruning. I thought I would have something playable in a weekend or so.</p>

<p>I was about 300 lines in, halfway through implementing alpha-beta, when something suddenly hit me. I stopped and actually thought about what this engine would be doing at runtime.</p>

<p>I was shocked that I had overlooked the most fundamental issue in my design.</p>

<p>Lets think about what a chess engine actually does. Its entire job is to find the best move, which means recursively exploring positions. At depth 6 (which is considered very basic) with an average of ~30 legal moves per position, we are looking at 30^6 which is roughly 729 million nodes. At each of those nodes, the engine needs to apply a move, evaluate the position, and undo it. That happens millions of times in a second or so.</p>

<div class="complexity-chart">
<h3>Search tree size — branching factor ~30</h3>
<div class="bar-row">
<div class="bar-label">Depth 2</div>
<div class="bar-track"><div class="bar-fill dark" style="width:1%">900</div></div>
</div>
<div class="bar-row">
<div class="bar-label">Depth 4</div>
<div class="bar-track"><div class="bar-fill dark" style="width:10%">810K</div></div>
</div>
<div class="bar-row">
<div class="bar-label">Depth 6</div>
<div class="bar-track"><div class="bar-fill red" style="width:55%">~729M</div></div>
</div>
<div class="bar-row">
<div class="bar-label">Depth 8</div>
<div class="bar-track"><div class="bar-fill red" style="width:100%">~656B 🔥</div></div>
</div>
</div>

<p>Now, my engine Raven actually passes the board by reference so there's no full copy per node. But with a class hierarchy of heap allocated piece objects, the problem is just differently shaped, undoing a move on a <code>vector&lt;vector&lt;Piece*&gt;&gt;</code> is fragile and messy, evaluating a position means iterating containers, and every piece access is a pointer dereference, which is terrible for cache performance. At 729 million nodes, this overhead compounds into something that makes the engine unplayably slow.</p>

<p>
So I stepped back and looked into how Stockfish and other real engines are built. The answer was, don't use classes. Represent your board as integers. Specifically, 64-bit integers.
</p>

<p>Basically there are other ways too to optimally represent the board, but I chose bitboard because of the simplicity.</p>

<div class="sep">♟</div>

<h2>Bitboards: The Whole Board in 64 Bits</h2>

<p>A chessboard has 64 squares. A <code>uint64_t</code> has 64 bits. One bit per square. That's the whole idea.</p>

<p>
Instead of a 2D array of piece objects, you store the board as 12 integers, one for each piece type per color. Each integer is a bitboard where a 1 means that piece occupies that square, and a 0 means it doesn't. Here's what that looks like in Raven:
</p>

<div class="code-wrap">
<div class="code-header">
<span class="code-filename">board.h</span>
<span class="code-lang">C++</span>
</div>
<pre><span class="kw">struct</span> <span class="tp">Board</span> {
<span class="tp">uint64_t</span> whitePawns   <span class="op">=</span> <span class="num">0x000000000000FF00ULL</span><span class="op">;</span>
<span class="tp">uint64_t</span> whiteKnights <span class="op">=</span> <span class="num">0x0000000000000042ULL</span><span class="op">;</span>
<span class="tp">uint64_t</span> whiteBishops <span class="op">=</span> <span class="num">0x0000000000000024ULL</span><span class="op">;</span>
<span class="tp">uint64_t</span> whiteRooks   <span class="op">=</span> <span class="num">0x0000000000000081ULL</span><span class="op">;</span>
<span class="tp">uint64_t</span> whiteQueen   <span class="op">=</span> <span class="num">0x0000000000000008ULL</span><span class="op">;</span>
<span class="tp">uint64_t</span> whiteKing    <span class="op">=</span> <span class="num">0x0000000000000010ULL</span><span class="op">;</span>
<span class="cm">// ... same 6 for black</span>
<span class="tp">uint64_t</span> allPieces<span class="op">;</span>
<span class="op">};</span></pre>
</div>

<p>The entire board state is 12 integers sitting next to each other in memory. The whole thing fits in cache. Copying a board? Copy a struct. Done in nanoseconds.</p>

<p>I made this interative chess board using claude, click through the pieces below to see what each bitboard actually represents on the board.</p>

<div class="board-visual">
<h3>Bitboard visualizer — click a piece type</h3>
<div class="chess-grid" id="chess-grid"></div>
<div class="board-caption" id="board-caption">White Pawns: 0x000000000000FF00 — all of rank 2 lit up</div>
<div class="board-controls">
<button class="board-btn active-btn" data-bitboard="whitePawns" type="button">White Pawns</button>
<button class="board-btn" data-bitboard="whiteKnights" type="button">Knights</button>
<button class="board-btn" data-bitboard="whiteRooks" type="button">Rooks</button>
<button class="board-btn" data-bitboard="allWhite" type="button">All White</button>
<button class="board-btn" data-bitboard="startpos" type="button">Start Position</button>
</div>
</div>

<p>Now comes the best part, because it's just bits, making a move is just bit operations. To move a pawn from e2 to e4, you XOR the e2 bit off and OR the e4 bit on. Two operations. Undo it? Same thing in reverse. What used to require carefully updating object state and managing pointers is now a handful of CPU instructions that execute in a single clock cycle.</p>

<div class="xor-demo">
<div class="xor-row">
<span class="xor-label">whitePawns (before)</span>
<span class="xor-bits">00000000 00000000 00000000 00000000 00000000 00000000 <span class="hi">11111111</span> 00000000</span>
</div>
<div class="xor-row">
<span class="xor-label xor-op">XOR e2 off, OR e4 on</span>
<span class="xor-bits">00000000 00000000 00000000 00000000 <span class="hi">00010000</span> 00000000 <span class="hi">11101111</span> 00000000</span>
</div>
<div class="xor-divider"></div>
<div class="xor-row">
<span class="xor-label xor-result">whitePawns (after)</span>
<span class="xor-bits">00000000 00000000 00000000 00000000 <span class="hi">00010000</span> 00000000 <span class="hi">11101111</span> 00000000</span>
</div>
<div style="margin-top: 0.5rem">
<span class="xor-comment">Pawn moved e2 to e4. Two bitwise ops. No heap, no pointers, no objects.</span>
</div>
</div>

<div class="sep">♟</div>

<h2>Move Generation</h2>

<p>Once we have bitboards, move generation becomes genuinely elegant. Instead of asking "where can this specific piece go?", we compute entire attack sets in one expression.</p>

<p>Knight moves are a good example. No matter where the knight is, it has exactly 8 possible jump patterns. With a bitboard, you compute all 8 targets simultaneously using bit shifts, masking off the edge files to prevent wrap-around like the knights going off the board.</p>

<div class="code-wrap">
<div class="code-header">
<span class="code-filename">move_gen.cpp — all 8 knight jumps in one shot</span>
<span class="code-lang">C++</span>
</div>
<pre><span class="tp">uint64_t</span> attacks <span class="op">=</span>
(POS <span class="op"><<</span> <span class="num">17</span> <span class="op">&</span> <span class="op">~</span>aFile) <span class="op">|</span>  <span class="cm">// +2 ranks, +1 file</span>
(POS <span class="op"><<</span> <span class="num">15</span> <span class="op">&</span> <span class="op">~</span>hFile) <span class="op">|</span>  <span class="cm">// +2 ranks, -1 file</span>
(POS <span class="op"><<</span> <span class="num">10</span> <span class="op">&</span> <span class="op">~</span>abFile)<span class="op">|</span>  <span class="cm">// +1 rank, +2 files</span>
(POS <span class="op"><<</span>  <span class="num">6</span> <span class="op">&</span> <span class="op">~</span>ghFile)<span class="op">|</span>  <span class="cm">// +1 rank, -2 files</span>
<span class="cm">// ... 4 more in the other direction</span>

<span class="kw">return</span> attacks <span class="op">&</span> <span class="op">~</span>ownPieces<span class="op">;</span>  <span class="cm">// can't land on your own pieces</span></pre>
</div>

<p>Eight possible squares, computed in parallel with shifts. No loops and bounds checking.</p>

<div class="sep">♟</div>

<h2>Alpha-Beta: Making the Engine Somewhat Smart</h2>

<p>With move generation working, minimax was next. The algorithn is simple, recursively explore all possible moves, assume the opponent always plays their best move, and return the move that leads to the best outcome for us.</p>

<p>The problem is pure minimax is stupid-slow. With 729 million nodes at depth 6, we need a way to skip searching branches that can't possibly affect the final result. That's what alpha-beta pruning does.</p>

<p>Think of it like limits for the score. Alpha is the best score White has found so far. Beta is the best score Black has found. The moment we find a position where the opponent would never allow it because they already have something better, we stop searching that branch entirely. In best case scenario, alpha-beta cuts the search tree roughly in half, letting you reach the same depth with far fewer nodes.</p>

<p>
The engine started playing real chess after this. But then I sat down to actually play against it.
</p>

<div class="sep">♟</div>

<h2>The First Actual Game</h2>

<p>Within 10 moves, it blundered its queen. I did not set any kind of trap. I just put my bishop where it could take the queen on the next move, and the engine completely ignored it and played something else. I took the queen. Game over.</p>

<p>I stared at the board for a while thinking there must be a bug in capture detection. There wasn't.</p>

<p>Alpha-beta pruning only works well if you search the best moves first. If you feed it moves in a random order, it is just a brute-force minimax. With a time limit running, the engine was burning its entire budget on quiet pawn pushes and positional moves before it ever got to the move that captures a hanging queen. The capture was there in the list. It just never got searched in time.</p>

<p>But one game doesn't expose the patterns, I needed a way to automate the games.</p>

<div class="testing-note">
<span class="testing-label">How I test Raven</span>
<p>Every improvement I make gets validated through <strong>CuteChess CLI</strong>, a headless tournament runner that automates engine matches. My benchmark is a 50-game series against a Stockfish instance set to Elo 1400, running at 10+0.1 time control. Its a good basic benchmark, and watching the win rate climb with each optimization is the whole point.</p>
<p>Just a small note: To test this the engine must follow UCI protocol. I have not covered it in this article, but you can read about it <a href="https://www.chessprogramming.org/UCI"><b>here</b></a> </p>
<div class="cutechess-cmd">
cutechess-cli \\<br>
cmd=./raven proto=uci -engine \\ <br> cmd=stockfish proto=uci \\ <br>
option.UCI_LimitStrength=true \\ <br>
option.UCI_Elo=1400 -each tc=10+0.1 \\ <br>
-rounds 50 -concurrency 10 \\ <br>
</div>
</div>

<div class="result-placeholder">
<div class="rp-header">
<span class="rp-label">📊 After Alpha-Beta — 50 games vs Stockfish </span>
<span class="rp-tag">10+0.1 time control</span>
</div>
<div class="rp-body">
<div class="rp-score-row">
<div class="rp-engine">Raven</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:14%">7</div></div>
<div class="rp-num">7 / 50</div>
</div>
<div class="rp-score-row">
<div class="rp-engine">Stockfish</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:68%">34</div></div>
<div class="rp-num">34 / 50</div>
</div>

<div class="rp-score-row">
<div class="rp-engine">Draw</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:18%">9</div></div>
<div class="rp-num">9 / 50</div>
</div>
<p class="rp-note">We just won 7 matches out 50, around 14% winning rate. At this point we are we are losing alot more than winning and drawing.</p>
</div>
</div>

<div class="sep">♟</div>

<h2>Move Ordering: MVV-LVA</h2>

<p>The fix is to sort moves before searching them. Specifically, look at captures first, and within captures, prefer ones where a cheap piece takes an expensive one. This heuristic is called MVV-LVA: Most Valuable Victim, Least Valuable Attacker.</p>

<p>PxQ (pawn captures queen) should be searched before QxP. A pawn taking a queen is almost certainly a good trade. A queen taking a pawn is probably fine but shouldn't jump the queue over potentially brilliant captures.</p>

<div class="code-wrap">
<div class="code-header">
<span class="code-filename">move_gen.cpp — MVV-LVA move scoring</span>
<span class="code-lang">C++</span>
</div>
<pre><span class="kw">constexpr int</span> MVV_LVA[<span class="num">7</span>] <span class="op">=</span> {<span class="num">0</span>, <span class="num">100</span>, <span class="num">300</span>, <span class="num">300</span>, <span class="num">500</span>, <span class="num">900</span>, <span class="num">10000</span>}<span class="op">;</span>

score <span class="op">=</span> <span class="num">10</span> <span class="op">*</span> MVV_LVA[victim] <span class="op">-</span> MVV_LVA[attacker]<span class="op">;</span>
<span class="cm">// PxQ  = 10*900 - 100 = 8900  (searched first)</span>
<span class="cm">// QxP  = 10*100 - 900 = 100   (searched later)</span></pre>
</div>

<p>After sorting by this score, alpha-beta starts seeing the good moves first. Branch cutoffs that previously required looking at 20 moves now trigger after 2. The queen hanging on the board? The engine took it immediately. The same time budget now reaches 2-3 plies deeper than before.</p>


<div class="result-placeholder">
<div class="rp-header">
<span class="rp-label">📊 After Alpha-Beta + MVV-LVA — 50 games vs Stockfish</span>
<span class="rp-tag">10+0.1 time control</span>
</div>
<div class="rp-body">
<div class="rp-score-row">
<div class="rp-engine">Raven</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:30%">15</div></div>
<div class="rp-num">15 / 50</div>
</div>
<div class="rp-score-row">
<div class="rp-engine">Stockfish</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:46%">23</div></div>
<div class="rp-num">23 / 50</div>
</div>

<div class="rp-score-row">
<div class="rp-engine">Draw</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:24%">12</div></div>
<div class="rp-num">12 / 50</div>
</div>
<p class="rp-note">We won around 30% of the game. A decent jump from our last test where we won in just around 14% of the matches. At this point we are starting to draw even more.</p>
</div>
</div>

<div class="sep">♟</div>

<h2>The Engine Works. But Is It Efficient?</h2>

<p>Searches are happening, moves are decent, it no longer hangs its queen. But I kept noticing positions that took noticeably longer to evaluate than others.</p>

<p>Here's what was happening. Suppose at depth 6 the engine starts calculating the best move for some position X. It does the work, finds the best score, and moves on. Later, through a different sequence of moves, it reaches position X again. What does it do? It calculates everything from scratch. Same position, same search, same result. It just wastes CPU cycles.</p>

<p>This should sound familiar. It's the exact same problem dynamic programming solves. Overlapping subproblems.</p>

<p>The fix is a <strong>transposition table</strong>, its basically a cache of positions we have already evaluated. Look it up before searching. If it's there at a useful depth, use the stored result and skip the whole search.</p>

<div class="sep">♟</div>

<h2>Transposition Tables + Zobrist Hashing</h2>

<p>To cache a position, you need a key for it. And the key needs to uniquely identify the full game state like piece positions, whose turn it is, castling rights, en passant square. Lets think about what that actually looks like if you tried to represent it naively as a multi-dimensional array:</p>

<div class="dp-table">
<h3>What uniquely identifies a chess position</h3>
<div class="dp-row">
<span class="dp-key">Piece positions</span>
<span class="dp-val">12 x 64</span>
<span class="dp-why">one bit per piece type per square</span>
</div>
<div class="dp-row">
<span class="dp-key">Side to move</span>
<span class="dp-val">x 2</span>
<span class="dp-why">white or black</span>
</div>
<div class="dp-row">
<span class="dp-key">Castling rights</span>
<span class="dp-val">x16</span>
<span class="dp-why">4 bits: KQkq (K - white king side castling, k - black king side castling, Q - white queen side castling, q - black queen side castling) </span>
</div>
<div class="dp-row">
<span class="dp-key">En passant file</span>
<span class="dp-val">x8</span>
<span class="dp-why">only the file matters (rank is always 3 or 6)</span>
</div>
<div class="dp-row">
<span class="dp-key">Search depth</span>
<span class="dp-val">x 6</span>
<span class="dp-why">deeper results are more useful</span>
</div>
<div class="dp-row">
<span class="dp-key">Score type</span>
<span class="dp-val">x3</span>
<span class="dp-why">EXACT, ALPHA, or BETA (more on the types later)</span>
</div>
<div class="dp-total">
Total: 12 x 64 x 2 x 16 x 8 x 6 x 3 = ~3.5M entries minimum. And that's before even storing the score. This approach doesn't scale.
</div>
</div>

<p>So instead of indexing by all those parameters, we hash the board state into a single 64-bit number. That becomes the key for a simple array lookup. This is Zobrist hashing.</p>

<p>The idea is, at startup, generate a random 64-bit number for every (piece type, square) combination, 768 numbers total. The board's hash is the XOR of all those numbers for every piece currently on the board. Changing one piece? Just XOR the old entry off and the new one on. No rehashing from scratch.</p>

<p>Theres one subtlety that tripped me up early. My first instinct was to just assign sequential numbers to each piece-square pair, 1 for white pawn on a1, 2 for white pawn on b1, and so on. That breaks badly.</p>

<p>Here's a simpler version of the problem. Say you have 4 students with IDs: A=2, B=3, C=4, D=5. If A and C are present, their XOR is 6. If B and D are present, their XOR is also 6. Same hash, totally different state. XOR collisions happen constantly with sequential values because structurally similar inputs tend to cancel each other out.</p>

<p>The fix is randomness, assign large random 64-bit numbers. With 768 entries drawn from a space of 2^64 possibilities, the chances of two different board states hashing to the same value become negligible.</p>

<p>Now for the tricky part: integrating this with alpha-beta. When you look up a position in the table, you can't always just use the stored score blindly. Why? Because alpha-beta prunes branches, which means some stored scores were computed with incomplete information.</p>

<p>There are three types of Transposition Table (TT) entries:</p>

<p>
<strong>EXACT</strong> means the node was searched completely and the true minimax score is known exactly.
This usually happens when the final score lies strictly inside the alpha-beta window.
Since the value is exact, we can reuse it directly.
</p>

<p>
<strong>ALPHA</strong> means the node <em>failed low</em>,
the score never became large enough to raise alpha.
The search tells us that the true score is at most this value, but not the exact score.
So an ALPHA entry stores an <strong>upper bound</strong>: <code>true_score <= entry.score</code>
</p>

<p>Here <code>true_score</code> means the actual score we would get if we would have explored the branches fully.</p>

<p>
During retrieval, if: <code>entry.score <= alpha</code>
</p>

<p>
then the position is guaranteed to fail low again, meaning it cannot improve the current search.
So we can safely return alpha immediately without searching the node again.
</p>

<p>
<strong>BETA</strong> means the node <em>failed high</em>,
the score became so good that it exceeded beta and caused a beta cutoff.
Since the search stopped early, we do not know the exact score,
only that the true score is at least this large.
So a BETA entry stores a <strong>lower bound</strong>: <code>true_score >= entry.score</code>
</p>

<p>
During retrieval, if: <code>entry.score >= beta</code>
</p>

<p>
then the position is guaranteed to fail high again and produce another cutoff.
So we can safely return beta immediately.
</p>

<p>
The important detail is that ALPHA and BETA entries do not store exact evaluations.
They store logical constraints discovered during alpha-beta pruning.
This is why the engine must remember whether the stored value is an upper bound or a lower bound, the number alone is not enough.
</p>
<p>One important thing: we only use a TT entry if it was computed at a depth greater than or equal to the current search depth. A result from a 3-ply search isn't useful when you are doing a 6-ply search, basically you will find a better answer by just searching deeper.</p>

<div class="code-wrap">
<div class="code-header">
<span class="code-filename">engine.cpp — TT lookup inside minimax</span>
<span class="code-lang">C++</span>
</div>
<pre><span class="tp">TTEntry</span> <span class="op">&</span>entry <span class="op">=</span> tt[board.hash <span class="op">%</span> TT_SIZE]<span class="op">;</span>
<span class="kw">if</span> (entry.hash <span class="op">==</span> board.hash <span class="op">&&</span> entry.depth <span class="op">>=</span> depth) {
<span class="kw">if</span> (entry.type <span class="op">==</span> EXACT) <span class="kw">return</span> entry.score<span class="op">;</span>
<span class="kw">if</span> (entry.type <span class="op">==</span> ALPHA <span class="op">&&</span> entry.score <span class="op"><=</span> alpha) <span class="kw">return</span> alpha<span class="op">;</span>
<span class="kw">if</span> (entry.type <span class="op">==</span> BETA  <span class="op">&&</span> entry.score <span class="op">>=</span> beta)  <span class="kw">return</span> beta<span class="op">;</span>
}</pre>
</div>

<div class="result-placeholder">
<div class="rp-header">
<span class="rp-label">📊 After Adding Transposition Table — 50 games vs Stockfish</span>
<span class="rp-tag">10+0.1 time control</span>
</div>

<div class="rp-body">
<div class="rp-score-row">
<div class="rp-engine">Raven</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:44%">22</div></div>
<div class="rp-num">22 / 50</div>
</div>
<div class="rp-score-row">
<div class="rp-engine">Stockfish</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:38%">19</div></div>
<div class="rp-num">19 / 50</div>
</div>

<div class="rp-score-row">
<div class="rp-engine">Draw</div>
<div class="rp-bar-wrap"><div class="rp-bar bar-fill red" style="width:18%">9</div></div>
<div class="rp-num">9 / 50</div>
</div>
<p class="rp-note">Now we are beating stockfish more often. 44% win rate and 18% draw rate are decent stats for now.</p>
</div>
</div>
<div class="sep">♟</div>

<h2>Playing Under Time Pressure</h2>

<p>There's one more problem. All of this is useless if the engine can't play a real game under actual chess time controls. If it just keeps searching until it hits some hardcoded depth, it will either be too slow and lose on time, or too shallow and make bad moves.</p>

<p>Standard chess time controls work like this - each player gets a total clock (say, 10 minutes) plus an increment added after every move (say, 2 seconds). So a "10+2" match means you start with 10 minutes and gain 2 seconds back each time you play a move. Some tournaments also reset clocks after a fixed number of moves.</p>

<p>The engine needs to decide how long to spend on each move. Too long on an easy position burns time needed later. Too short on a critical position and you miss something important.</p>

<p>I used a simple formula:</p>

<div class="xor-demo" style="font-size:14px; line-height: 2.2;">
<span style="color:#ffcb6b;">timeLimitMs</span>
<span style="color:#89ddff;"> = </span>
<span style="color:#c3e88d;">(timeRemaining / movesToGo)</span>
<span style="color:#89ddff;"> + </span>
<span style="color:#c3e88d;">(autoIncrement / 2)</span>
<br>
<span style="color:#546e7a; font-style:italic; font-size:12px;">
Divide remaining time evenly across expected moves, plus half the increment as a bonus.
If this comes out practically very small like less then 10ms, spend at least 50ms.
</span>
</div>

<p>This works well enough in practice. The engine allocates time proportionally rather than blowing its budget early or playing blindingly fast in time trouble.</p>

<p>But there's a related problem, what depth should the engine search to? If you hardcode depth 6, sometimes the engine uses up all its time and yet doesnt find the move. The solution is <strong>iterative deepening</strong>, start at depth 1, get a best move, then search to depth 2, then depth 3, and so on, always keeping the best move from the deepest completed search. When time runs out, you return whatever the best move was at the last fully completed depth.</p>

<div class="code-wrap">
<div class="code-header">
<span class="code-filename">engine.cpp — iterative deepening loop</span>
<span class="code-lang">C++</span>
</div>
<pre><span class="kw">for</span> (<span class="kw">int</span> depth <span class="op">=</span> <span class="num">1</span><span class="op">;</span> depth <span class="op"><=</span> <span class="num">50</span><span class="op">;</span> depth<span class="op">++</span>) {
bestMoveAtDepth <span class="op">=</span> <span class="fn">searchAtDepth</span>(board, depth, timelimitms)<span class="op">;</span>

<span class="kw">if</span> (stopSearch) <span class="kw">break</span><span class="op">;</span>  <span class="cm">// time ran out mid-search</span>

bestMoveOverall <span class="op">=</span> bestMoveAtDepth<span class="op">;</span>  <span class="cm">// commit only completed depths</span>

<span class="kw">}</pre>
</div>

<p>There's a nice bonus here too. Iterative deepening works well with the transposition table. The results from depth 3 get cached, so when you search depth 4, you're starting from a much better state than if you had jumped straight to depth 4. The TT essentially gives you the best moves from the previous depth for free, which makes move ordering at each successive depth dramatically better.</p>

<div class="sep">♟</div>

<h2>Where Raven Stands</h2>

<p>
Raven currently implements bitboards, alpha-beta pruning, iterative deepening,
transposition tables, move ordering, and basic time management. In its current state,
the engine plays at roughly a 1500–1600 level depending on the time control.
</p>

<p>
There is still a lot left to improve. The evaluation function is fairly simple,
many heuristics are still missing, and several parts of the search and move generation
can be optimized further. The codebase itself is also far from where I want it to be yet.
</p>

<p>
This project is basically a personal learning log as much as it is an engine. Most of the work so far
has been less about chasing strength immediately and more about understanding how chess engines are
actually structured internally, from board representation and search behavior to memory layout and
performance tradeoffs.
</p>

<p>
Even so, getting the engine to this point has been satisfying. Watching the search stabilize,
seeing the engine start to find reasonable moves consistently, and gradually replacing naive
implementations with more efficient ones made the project feel much more concrete than it did
at the beginning.
</p>
  `,
  tags: ['chess', 'c++', 'engine', 'bitboards', 'algorithms', 'raven'],
  readTime: '18 min read',
  related: [],
}

export default blogPost
