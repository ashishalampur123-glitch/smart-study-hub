import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- C PROGRAMMING ---
  {
    id: 'c-q1',
    subjectId: 'c-programming',
    topic: 'Pointers & Dereferencing',
    question: 'What is the value of *ptr after executing: int a = 15; int *ptr = &a; *ptr = *ptr + 10; ?',
    options: ['15', '25', 'Address of a', 'Compilation Error'],
    correctIndex: 1,
    explanation: 'ptr holds the memory address of a. The dereference operator *ptr retrieves the value 15. Adding 10 updates the contents of variable a directly to 25.',
    difficulty: 'easy'
  },
  {
    id: 'c-q2',
    subjectId: 'c-programming',
    topic: 'Memory Allocation',
    question: 'Which function in <stdlib.h> allocates heap memory and initializes all bytes to zero?',
    options: ['malloc()', 'calloc()', 'realloc()', 'valloc()'],
    correctIndex: 1,
    explanation: 'calloc(n, size) initializes all allocated bytes to zero (0x00), whereas malloc(size) allocates raw bytes containing leftover garbage values.',
    difficulty: 'easy'
  },
  {
    id: 'c-q3',
    subjectId: 'c-programming',
    topic: 'Pointer Arithmetic',
    question: 'If int *p points to memory address 0x2000 on a 64-bit architecture with 4-byte integers, what address does (p + 3) evaluate to?',
    options: ['0x2003', '0x2006', '0x200C', '0x2018'],
    correctIndex: 2,
    explanation: 'Pointer arithmetic scales by sizeof(*p). Adding 3 steps forward by 3 * 4 = 12 bytes. In hexadecimal, 12 is 0xC, so 0x2000 + 0xC = 0x200C.',
    difficulty: 'medium'
  },
  {
    id: 'c-q4',
    subjectId: 'c-programming',
    topic: 'Data Structures & Unions',
    question: 'What is the primary difference between a struct and a union in C?',
    options: [
      'Structs can only store integers, while unions store any type',
      'Union members share the same memory space, whereas struct members each have distinct memory offsets',
      'Structs are allocated on the heap, whereas unions are allocated on the stack',
      'Unions do not support typedef'
    ],
    correctIndex: 1,
    explanation: 'In a union, all member variables overlap and share the same memory location, with the total size equal to the largest member. In a struct, every member has its own allocated offset.',
    difficulty: 'medium'
  },
  {
    id: 'c-q5',
    subjectId: 'c-programming',
    topic: 'File Handling',
    question: 'Which mode string in fopen() opens an existing file for reading and writing in binary mode without truncating it?',
    options: ['"w+b"', '"rb+"', '"a+b"', '"r"'],
    correctIndex: 1,
    explanation: '"rb+" (or "r+b") opens an existing binary file for both reading and writing from the start without discarding existing data. "w+b" truncates the file to 0 bytes.',
    difficulty: 'hard'
  },

  // --- ENGINEERING MATHEMATICS ---
  {
    id: 'math-q1',
    subjectId: 'engg-maths',
    topic: 'Linear Algebra',
    question: 'If the eigenvalues of a 3x3 matrix A are 2, 4, and 5, what is the trace of matrix A?',
    options: ['40', '11', '22', '10'],
    correctIndex: 1,
    explanation: 'The trace of any square matrix equals the sum of its eigenvalues. Here, Trace = 2 + 4 + 5 = 11.',
    difficulty: 'easy'
  },
  {
    id: 'math-q2',
    subjectId: 'engg-maths',
    topic: 'Matrix Invariance',
    question: 'If a matrix has an eigenvalue equal to 0, which of the following statements must be true?',
    options: [
      'The matrix is orthogonal',
      'The determinant of the matrix is zero (singular matrix)',
      'The matrix has no eigenvectors',
      'The trace is zero'
    ],
    correctIndex: 1,
    explanation: 'The determinant of a matrix equals the product of all its eigenvalues. If any eigenvalue is 0, then det(A) = 0, proving the matrix is singular and has no multiplicative inverse.',
    difficulty: 'easy'
  },
  {
    id: 'math-q3',
    subjectId: 'engg-maths',
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of the function f(t) = e^(3t) ?',
    options: ['1 / (s + 3)', '1 / (s - 3)', '3 / s', '1 / s²'],
    correctIndex: 1,
    explanation: 'By the standard Laplace integral formula L{e^(at)} = 1 / (s - a) for s > a. For a = 3, L{e^(3t)} = 1 / (s - 3).',
    difficulty: 'medium'
  },
  {
    id: 'math-q4',
    subjectId: 'engg-maths',
    topic: 'Vector Calculus',
    question: 'A vector field F is defined as Solenoidal if which condition is met?',
    options: ['∇ × F = 0 (Curl is zero)', '∇ · F = 0 (Divergence is zero)', '∇²F = 0 (Laplacian is zero)', '|F| = constant'],
    correctIndex: 1,
    explanation: 'A vector field is solenoidal (incompressible) when its divergence ∇ · F is identically zero throughout the domain, signifying zero net outward flux.',
    difficulty: 'medium'
  },
  {
    id: 'math-q5',
    subjectId: 'engg-maths',
    topic: 'Integral Theorems',
    question: 'Which fundamental theorem transforms a surface integral over a closed boundary into a volume integral of divergence?',
    options: ["Green's Theorem", "Stokes' Theorem", "Gauss Divergence Theorem", "Cauchy's Residue Theorem"],
    correctIndex: 2,
    explanation: "The Gauss Divergence Theorem states that ∯ (F · n) dS = ∭ (∇ · F) dV, converting closed flux boundary integrals into interior volume integration.",
    difficulty: 'hard'
  },

  // --- ENGINEERING PHYSICS ---
  {
    id: 'phys-q1',
    subjectId: 'engg-physics',
    topic: 'Interference',
    question: 'In Newton’s rings experiment viewed under reflected light, why is the central spot dark?',
    options: [
      'Destructive interference due to an automatic phase change of π upon reflection at the glass plate',
      'Absorption of light by the plano-convex lens',
      'Diffraction around the contact point',
      'The optical path difference is exactly λ'
    ],
    correctIndex: 0,
    explanation: 'At the point of contact, film thickness t = 0. However, reflection from the denser lower glass plate introduces an extra phase jump of π (or path difference of λ/2) according to Stokes’ relation, resulting in complete destructive interference.',
    difficulty: 'medium'
  },
  {
    id: 'phys-q2',
    subjectId: 'engg-physics',
    topic: 'Lasers',
    question: 'What essential condition is necessary for sustained laser amplification in an optical resonator?',
    options: ['Spontaneous absorption', 'Population inversion', 'Thermal equilibrium', 'Complete vacuum'],
    correctIndex: 1,
    explanation: 'Population Inversion (having more atoms in the excited metastable state N2 than the ground state N1) is mandatory so stimulated emission dominates over spontaneous absorption.',
    difficulty: 'easy'
  },
  {
    id: 'phys-q3',
    subjectId: 'engg-physics',
    topic: 'Fibre Optics',
    question: 'What is the condition for light to undergo Total Internal Reflection (TIR) inside an optical fiber?',
    options: [
      'Core refractive index must be smaller than cladding (n1 < n2)',
      'Core refractive index must be greater than cladding (n1 > n2) and angle of incidence > critical angle',
      'Light must be unpolarized',
      'Wavelength must be in the ultraviolet region'
    ],
    correctIndex: 1,
    explanation: 'Total internal reflection requires the light to travel from a denser optical medium (core, n1) towards a rarer medium (cladding, n2), where n1 > n2, and the incidence angle must exceed the critical angle.',
    difficulty: 'easy'
  },
  {
    id: 'phys-q4',
    subjectId: 'engg-physics',
    topic: 'Solid State & Hall Effect',
    question: 'In the Hall effect experiment, what does a negative Hall coefficient (Rh < 0) signify?',
    options: [
      'The majority charge carriers are electrons',
      'The majority charge carriers are positive holes',
      'The material is an insulator',
      'The magnetic field is misaligned'
    ],
    correctIndex: 0,
    explanation: 'Because Hall coefficient Rh = 1 / (n · q), the negative sign of electron charge (q = -e) results in a negative Hall coefficient, confirming an n-type semiconductor.',
    difficulty: 'medium'
  },
  {
    id: 'phys-q5',
    subjectId: 'engg-physics',
    topic: 'Superconductivity',
    question: 'The complete expulsion of magnetic flux lines from the interior of a superconductor below its critical temperature is called:',
    options: ['Zeeman Effect', 'Meissner Effect', 'Compton Effect', 'Kerr Effect'],
    correctIndex: 1,
    explanation: 'The Meissner Effect is the hallmark of superconductivity, demonstrating ideal diamagnetism where magnetic induction B drops to zero inside the specimen (B = 0).',
    difficulty: 'medium'
  },

  // --- ENVIRONMENTAL STUDIES ---
  {
    id: 'env-q1',
    subjectId: 'env-studies',
    topic: 'Ecosystem Ecology',
    question: 'According to Lindeman’s 10% law, if 10,000 Joules of energy are available at the primary producer (plant) level, how much energy reaches secondary consumers (carnivores)?',
    options: ['10,000 J', '1,000 J', '100 J', '10 J'],
    correctIndex: 2,
    explanation: 'Primary producers: 10,000 J. Primary consumers (herbivores) receive 10% = 1,000 J. Secondary consumers (carnivores) receive 10% of 1,000 J = 100 J.',
    difficulty: 'easy'
  },
  {
    id: 'env-q2',
    subjectId: 'env-studies',
    topic: 'E-Waste & Electronics',
    question: 'Which hazardous heavy metal commonly found in legacy electronic solder is strictly restricted under the European Union RoHS directive?',
    options: ['Aluminum', 'Lead (Pb)', 'Silicon', 'Copper'],
    correctIndex: 1,
    explanation: 'Lead (Pb) has been banned or restricted in consumer electronics solders by RoHS directives due to its toxicity, bioaccumulation, and neurological damage.',
    difficulty: 'easy'
  },
  {
    id: 'env-q3',
    subjectId: 'env-studies',
    topic: 'Atmospheric Physics & Climate',
    question: 'Which of the following greenhouse gases has the highest Global Warming Potential (GWP) per molecule compared to CO2 over a 100-year timescale?',
    options: ['Water Vapor', 'Methane (CH4)', 'Oxygen', 'Argon'],
    correctIndex: 1,
    explanation: 'Methane (CH4) traps approximately 28 to 36 times more infrared radiation in the atmosphere than carbon dioxide per mass unit over 100 years.',
    difficulty: 'medium'
  },
  {
    id: 'env-q4',
    subjectId: 'env-studies',
    topic: 'Environmental Treaties',
    question: 'The Montreal Protocol (1987) is a landmark international treaty designed specifically to protect:',
    options: [
      'The ozone layer by phasing out Chlorofluorocarbons (CFCs)',
      'Wetlands of international importance',
      'Endangered marine species',
      'Rainforest deforestation rates'
    ],
    correctIndex: 0,
    explanation: 'The Montreal Protocol successfully regulated and phased out ozone-depleting substances (ODS), principally chlorofluorocarbons (CFCs) and halons.',
    difficulty: 'medium'
  },
  {
    id: 'env-q5',
    subjectId: 'env-studies',
    topic: 'Green Computing',
    question: 'In green data center engineering, what is the ideal metric value for Power Usage Effectiveness (PUE)?',
    options: ['0.0', '1.0', '2.5', '10.0'],
    correctIndex: 1,
    explanation: 'PUE = (Total Facility Power) / (IT Equipment Power). An ideal score is 1.0, signifying that 100% of incoming electricity directly powers compute hardware without any energy wasted on cooling or power distribution.',
    difficulty: 'hard'
  }
];
