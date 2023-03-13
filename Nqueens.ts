const ᚾ = Symbol()
const ᛊ = Symbol()
const ᛚ = Symbol()
const ᛞ = Symbol()


type Nil = typeof ᚾ

type Cons<x, xs> = [x, xs]
type Concat<seq1, seq2> = seq1 extends Nil 
    ? seq2 
    : seq1 extends Cons<infer car, infer cdr> 
    ? Cons<car, Concat<cdr, seq2>>
    : Cons<seq1, seq2>

type True = typeof ᛊ
type False = typeof ᛚ

type Not<b1> = b1 extends True ? False : b1 extends False ? True : never
type Or<b1, b2> = b1 extends True ? True : b2 extends True ? True : never

type AnyTrue<list> = list extends Cons<infer x, infer xs> 
    ? x extends True
        ? True
        : AnyTrue<xs>
    : False

type Zero = typeof ᛞ

type S<n> = [n]

type One = S<Zero>
type Two = S<One>
type Three = S<Two>
type Four = S<Three>
type Five = S<Four>
type Six = S<Five>


type Equals<a, b>  = a extends S<infer a_>
    ? b extends S<infer b_>
        ? Equals<a_, b_>
        : False
    : b extends Zero
        ? True
        : False

type AbsDiff<a, b> = a extends S<infer a_>
    ? b extends S<infer b_>
        ? AbsDiff<a_, b_>
        : a
    : b extends S<any>
        ? b
        : Zero

type RangeFromZeroTo<n, xs = Nil> = n extends S<infer n_>
    ? RangeFromZeroTo<n_, Cons<n, xs>>
    : Cons<Zero, xs>

type Queen<x, y> = [x, y]

type RowOfQueens<cols, row> = cols extends Cons<infer col, infer cols_>
    ? Cons<Queen<row, col>, RowOfQueens<cols_, row>>
    : cols

type Threatens<a,b> = a extends Queen<infer ax, infer ay>
    ? b extends Queen<infer bx, infer by>
        ? Or<
            Or<Equals<ax, bx>, Equals<ay, by>>,
            Equals<AbsDiff<ax, bx>, AbsDiff<ay, by>>
        >
        : never
    : never

type ThreatingQueens<placedQueens, queen> = 
    placedQueens extends Cons<infer placedQueen, infer placedQueens_>
    ? Cons<
        Threatens<placedQueen, queen>,
        ThreatingQueens<placedQueens_, queen>
        >
    : Nil

type Safe<placedQueens, queen> = Not<AnyTrue<ThreatingQueens<placedQueens, queen>>>

type FilterSafeQueens<candidates, placedQueens> = 
    candidates extends Cons<infer q, infer qs>
    ? Safe<placedQueens, q> extends True
        ? Cons<q, FilterSafeQueens<qs, placedQueens>>
        : FilterSafeQueens<qs, placedQueens>
    : Nil

type N = Six
type Next<row, placedQueens = Nil> = 
    FilterSafeQueens<RowOfQueens<RangeFromZeroTo<N>, row>, placedQueens>

type SolveNextRow<row, placedQueens> = 
    Solve<Next<S<row>, placedQueens>, S<row>, placedQueens>

type Solve<candidates, row, placedQueens> = Equals<row, N> extends True
    ? Concat<candidates, placedQueens>
    : candidates extends Cons<infer x, infer xs>
        ? SolveNextRow<row, Cons<x, placedQueens>> extends Nil
            ? Solve<xs, row, placedQueens>
            : SolveNextRow<row, Cons<x, placedQueens>>
    : Nil

type Solution = Solve<Next<Zero>, Zero, Nil>