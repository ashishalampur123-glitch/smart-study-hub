import { StudyNote } from '../types';

export const STUDY_NOTES: StudyNote[] = [
  // --- C PROGRAMMING ---
  {
    id: 'note-c-pointers',
    subjectId: 'c-programming',
    title: 'Pointers & Direct Memory Addressing',
    chapter: 'Unit 2: Pointers & Storage',
    readTime: '8 min read',
    difficulty: 'Core',
    summary: 'A deep dive into pointer declaration, dereference mechanics, pointer arithmetic, void pointers, and passing pointers to functions.',
    keyConcepts: [
      'A pointer is a variable that holds the raw memory address of another variable.',
      'The unary & (address-of) operator yields an address; unary * (indirection/dereference) accesses the stored value.',
      'Pointer arithmetic is typed: incrementing ptr adds sizeof(*ptr) bytes, not 1 byte.',
      'Dangling pointers point to deallocated memory and cause undefined behaviour.'
    ],
    formulasOrKeywords: [
      { label: '& (Address-of)', value: 'Retrieves the hex memory address of an lvalue', explanation: 'e.g. &x yields 0x7ffd...' },
      { label: '* (Dereference)', value: 'Fetches the value stored at the referenced address', explanation: '*ptr = 25 modifies x directly' },
      { label: 'Pointer Arithmetic', value: 'ptr + i => (char*)ptr + i * sizeof(type)', explanation: 'Steps through contiguous array cells' },
      { label: 'NULL Pointer', value: '((void*)0) sentinel value', explanation: 'Always check if (ptr != NULL) before dereferencing' }
    ],
    codeSnippet: {
      title: 'Pass-by-Reference & Pointer Arithmetic in C',
      language: 'c',
      code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int numbers[3] = {10, 20, 30};
    int *ptr = numbers; // points to numbers[0]

    printf("First: %d\\n", *ptr);         // 10
    printf("Second: %d\\n", *(ptr + 1));   // 20 (scaled by sizeof(int))
    
    int x = 5, y = 99;
    swap(&x, &y);
    printf("Swapped: x=%d, y=%d\\n", x, y); // x=99, y=5
    return 0;
}`,
      explanation: 'Pointers enable call-by-reference simulation in C. Passing addresses allows functions to modify the callers local stack frames directly without duplicating large memory payloads.'
    },
    contentSections: [
      {
        heading: '1. Memory Models & Address Resolution',
        body: [
          'In modern 32-bit and 64-bit architectures, computer memory is treated as an indexed linear sequence of byte-addressable cells. When a variable like int count = 42 is instantiated, the compiler assigns it a chunk of memory (typically 4 bytes).',
          'Pointers bridge high-level abstractions with raw hardware registers. By holding this exact memory address, algorithms achieve O(1) in-place array manipulation, dynamic buffer allocations, and OS kernel interfacing.'
        ]
      },
      {
        heading: '2. Pointer Arithmetic Scaling Rules',
        body: [
          'Crucially, adding 1 to an integer pointer int *p does NOT simply increment the address by 1 single byte. The C compiler automatically scales the step size by sizeof(*p).',
          'If p points to address 0x1000, p + 1 points to 0x1004 on a 32/64-bit machine with 4-byte integers. For a double* pointer (8 bytes), p + 1 moves to 0x1008.'
        ]
      },
      {
        heading: '3. Common Pitfalls: Wild & Dangling Pointers',
        body: [
          'Uninitialized pointers (wild pointers) contain whatever garbage bits were leftover in that stack register. Always initialize pointers to NULL or a valid address immediately.',
          'Never return the address of a local automatic stack variable from a function. Once the function returns, its stack frame is popped and overwritten, creating a disastrous dangling pointer.'
        ]
      }
    ],
    practiceQuestions: [
      {
        question: 'What is the output of *(arr + 3) if arr is an array of integers starting at index 0?',
        shortAnswer: 'It is equivalent to arr[3], accessing the 4th element of the array.'
      },
      {
        question: 'What is a void pointer (void*) and why is it useful?',
        shortAnswer: 'A generic pointer that can hold the address of any data type without type safety. It cannot be directly dereferenced without an explicit type cast.'
      }
    ]
  },
  {
    id: 'note-c-dynamic-memory',
    subjectId: 'c-programming',
    title: 'Dynamic Memory Allocation (malloc, calloc, free)',
    chapter: 'Unit 3: Heap Management',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    summary: 'Master runtime heap allocation with malloc, contiguous zero-initialized allocation with calloc, resizing with realloc, and avoiding memory leaks.',
    keyConcepts: [
      'Stack memory is fast and automatically managed, but fixed at compile time.',
      'Heap memory allows runtime sizing of arrays and linked structures using <stdlib.h>.',
      'malloc(size) leaves allocated bytes uninitialized; calloc(n, size) initializes all bytes to zero.',
      'Every byte allocated on the heap must be returned to the OS via free() to prevent memory leaks.'
    ],
    formulasOrKeywords: [
      { label: 'malloc()', value: 'void* malloc(size_t size)', explanation: 'Allocates uninitialized contiguous bytes on the heap' },
      { label: 'calloc()', value: 'void* calloc(size_t num, size_t size)', explanation: 'Allocates and zeroes out memory for num elements' },
      { label: 'realloc()', value: 'void* realloc(void *ptr, size_t new_size)', explanation: 'Grows/shrinks an existing block, possibly moving it' },
      { label: 'free()', value: 'void free(void *ptr)', explanation: 'Releases heap chunk. Set ptr = NULL immediately after!' }
    ],
    codeSnippet: {
      title: 'Safe Dynamic Array with Error Checking & free()',
      language: 'c',
      code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));

    // Mandatory null-check in production systems
    if (arr == NULL) {
        fprintf(stderr, "Heap allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }

    // Clean up
    free(arr);
    arr = NULL; // Defend against dangling pointer re-use

    return 0;
}`,
      explanation: 'Always verify malloc return values against NULL. On memory-constrained devices or large allocations, system failure without a check leads directly to a segmentation fault.'
    },
    contentSections: [
      {
        heading: '1. Stack vs Heap Architecture',
        body: [
          'Stack allocation is managed directly by the CPU architecture via the stack pointer register. It is exceptionally fast because allocating memory is as simple as moving the stack pointer. However, stack frames are limited in size (typically 1MB–8MB).',
          'Heap memory is a large pool of free memory managed by the OS runtime allocator. Dynamic allocation lets your program request variable memory based on user input, such as loading an arbitrary number of student records.'
        ]
      },
      {
        heading: '2. Difference Between malloc() and calloc()',
        body: [
          'malloc(n * sizeof(int)) allocates raw memory bytes. The initial contents are whatever values happened to reside in those physical RAM cells (garbage values).',
          'calloc(n, sizeof(int)) takes two parameters (count and element size) and explicitly sets every byte to zero (0x00). While slightly slower due to the clearing pass, it eliminates garbage read bugs.'
        ]
      }
    ]
  },
  {
    id: 'note-c-structures',
    subjectId: 'c-programming',
    title: 'Structures, Unions & Typedef in C',
    chapter: 'Unit 4: User-Defined Data Types',
    readTime: '6 min read',
    difficulty: 'Core',
    summary: 'Constructing composite data structures, memory padding, alignment considerations, union memory-sharing semantics, and nested structs.',
    keyConcepts: [
      'struct aggregates multiple variables of heterogeneous data types under a single identifier.',
      'union members share the exact same memory location; its size is determined by its largest member.',
      'Structure padding: compilers insert filler bytes to align members with CPU word boundaries.',
      'The dot operator (.) accesses direct struct fields; arrow operator (->) accesses fields via a pointer.'
    ],
    formulasOrKeywords: [
      { label: 'Dot Operator (.)', value: 's.name', explanation: 'Member access on value instances' },
      { label: 'Arrow Operator (->)', value: 'ptr->name <=> (*ptr).name', explanation: 'Member access on pointer to struct' },
      { label: 'Structure Padding', value: 'sizeof(struct) >= sum of members', explanation: 'Compilers pad fields to natural word boundaries (4 or 8 bytes)' },
      { label: 'Union Overlap', value: 'sizeof(union) == max(member sizes)', explanation: 'Used for memory optimization and variant packets' }
    ],
    codeSnippet: {
      title: 'Student Record Struct with Pointer Arrow Access',
      language: 'c',
      code: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int rollNumber;
    float cgpa;
} Student;

void printStudent(const Student *s) {
    // Arrow operator used for pointer dereferencing + access
    printf("Student: %s | Roll: %d | CGPA: %.2f\\n",
           s->name, s->rollNumber, s->cgpa);
}

int main() {
    Student s1;
    strcpy(s1.name, "Ashish Sharma");
    s1.rollNumber = 1042;
    s1.cgpa = 8.95;

    printStudent(&s1);
    return 0;
}`,
      explanation: 'Passing structs by const pointer avoids the overhead of copying the entire struct buffer onto the stack frame, saving cycles in embedded and high-performance computing.'
    },
    contentSections: [
      {
        heading: '1. Struct Alignment and Padding Mechanics',
        body: [
          'Modern 32-bit and 64-bit processors read memory in 4-byte or 8-byte chunks (words). If an integer is misaligned across a word boundary, the CPU must perform multiple memory accesses to stitch the bytes together.',
          'To optimize CPU throughput, compilers automatically inject padding bytes between fields. Reordering struct members from largest to smallest can significantly reduce wasted memory padding.'
        ]
      }
    ]
  },

  // --- ENGINEERING MATHEMATICS ---
  {
    id: 'note-math-eigenvalues',
    subjectId: 'engg-maths',
    title: 'Matrices, Eigenvalues & Cayley-Hamilton Theorem',
    chapter: 'Unit 1: Linear Algebra & Matrix Theory',
    readTime: '9 min read',
    difficulty: 'Core',
    summary: 'Characteristic equations, finding eigenvalues and eigenvectors, properties of symmetric matrices, and applying Cayley-Hamilton to find matrix inverses.',
    keyConcepts: [
      'For a square matrix A, non-zero vector X is an eigenvector if A·X = λ·X for scalar eigenvalue λ.',
      'Eigenvalues are roots of the characteristic polynomial: det(A - λ·I) = 0.',
      'Sum of eigenvalues equals the Trace of A (sum of main diagonal elements).',
      'Product of eigenvalues equals the Determinant: det(A) = λ1 · λ2 · ... · λn.',
      'Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic equation.'
    ],
    formulasOrKeywords: [
      { label: 'Characteristic Eq', value: '|A - λI| = 0', explanation: 'Solves for scalar eigenvalues λ' },
      { label: 'Trace Invariant', value: 'Tr(A) = Σ a_ii = Σ λ_i', explanation: 'Sum of main diagonal elements matches sum of eigenvalues' },
      { label: 'Determinant Invariant', value: 'det(A) = Π λ_i', explanation: 'If any λ = 0, the matrix is singular (non-invertible)' },
      { label: 'Cayley-Hamilton', value: 'P(A) = O => A^n + c_{n-1}A^{n-1} + ... + c_0 I = 0', explanation: 'Multiplying by A^-1 yields A^-1 in terms of powers of A' }
    ],
    contentSections: [
      {
        heading: '1. Eigenvalue Computation Protocol',
        body: [
          'Step 1: Set up the characteristic matrix [A - λI] by subtracting λ from each element on the main diagonal.',
          'Step 2: Compute the determinant |A - λI| and equate it to zero. For a 2x2 matrix, this yields: λ² - Tr(A)λ + det(A) = 0. For a 3x3 matrix: λ³ - (Tr)λ² + (Sum of minors of diagonal)λ - det(A) = 0.',
          'Step 3: Solve the polynomial roots to find eigenvalues λ1, λ2, etc.',
          'Step 4: For each eigenvalue, solve the homogeneous linear system (A - λI)X = 0 by Gaussian elimination to find the spanning eigenvector X.'
        ]
      },
      {
        heading: '2. Cayley-Hamilton Application to Inverses & Powers',
        body: [
          'The Cayley-Hamilton Theorem provides an elegant algebraic method to compute high matrix powers (like A^8) or inverse A^-1 without calculating adjugates.',
          'If λ² - 5λ + 6 = 0 is the characteristic equation of matrix A, then A² - 5A + 6I = 0. Multiplying through by A^-1: A - 5I + 6A^-1 = 0 => A^-1 = (1/6)(5I - A).'
        ]
      }
    ],
    practiceQuestions: [
      {
        question: 'If a 3x3 matrix has eigenvalues 1, 3, and -2, what is its determinant and trace?',
        shortAnswer: 'Trace = 1 + 3 + (-2) = 2. Determinant = (1)(3)(-2) = -6.'
      }
    ]
  },
  {
    id: 'note-math-laplace',
    subjectId: 'engg-maths',
    title: 'Laplace Transforms & Differential Equations',
    chapter: 'Unit 3: Integral Transforms',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    summary: 'Transforming time-domain signals into the complex frequency domain (s-plane), standard transforms, first & second shifting theorems, and solving initial value problems.',
    keyConcepts: [
      'Laplace Transform converts calculus (differentiation & integration) into simple algebra in the s-domain.',
      'Definition: L{f(t)} = F(s) = ∫[0 to ∞] e^(-st) f(t) dt.',
      'First Shifting Property: If L{f(t)} = F(s), then L{e^(at) f(t)} = F(s - a).',
      'Transform of derivative: L{f\'(t)} = s·F(s) - f(0).'
    ],
    formulasOrKeywords: [
      { label: 'L{1}', value: '1 / s (for s > 0)', explanation: 'Transform of unit step function' },
      { label: 'L{t^n}', value: 'n! / s^(n+1)', explanation: 'For positive integer n' },
      { label: 'L{sin(at)}', value: 'a / (s² + a²)', explanation: 'Sinusoidal signal' },
      { label: 'L{cos(at)}', value: 's / (s² + a²)', explanation: 'Cosine signal' },
      { label: 'L{e^(at)}', value: '1 / (s - a)', explanation: 'Exponential growth or decay' }
    ],
    contentSections: [
      {
        heading: '1. Why Engineers Use the Laplace Transform',
        body: [
          'In computer science and electrical engineering, dynamical systems (such as RLC circuits, mechanical dampers, and control algorithms) are modeled by differential equations.',
          'Classical methods require finding complementary functions and particular integrals. Laplace transforms automatically fold initial conditions (e.g., initial charge, voltage, or displacement) directly into the algebraic s-domain problem.'
        ]
      }
    ]
  },
  {
    id: 'note-math-calculus-vector',
    subjectId: 'engg-maths',
    title: 'Vector Calculus: Gradient, Divergence & Curl',
    chapter: 'Unit 4: Vector Fields & Theorems',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    summary: 'Physical interpretation of the Del (∇) operator, directional derivatives, solenoidal and irrotational vector fields, Green’s and Stokes’ Theorems.',
    keyConcepts: [
      'Gradient (∇φ) converts a scalar field into a vector field indicating the direction of maximum rate of increase.',
      'Divergence (∇ · F) represents the net outward flux of a vector field per unit volume (source vs sink).',
      'If ∇ · F = 0, the field is Solenoidal (incompressible flow, e.g. magnetic fields).',
      'Curl (∇ × F) measures rotation or vorticity around a point. If ∇ × F = 0, the field is Irrotational / Conservative.'
    ],
    formulasOrKeywords: [
      { label: 'Gradient', value: '∇φ = (∂φ/∂x)i + (∂φ/∂y)j + (∂φ/∂z)k', explanation: 'Points in direction of steepest ascent' },
      { label: 'Divergence', value: 'div F = ∇ · F = ∂F1/∂x + ∂F2/∂y + ∂F3/∂z', explanation: 'Scalar field representing flux density' },
      { label: 'Curl', value: 'curl F = ∇ × F = det([i, j, k; ∂/∂x, ∂/∂y, ∂/∂z; F1, F2, F3])', explanation: 'Vector representing rotational swirl' },
      { label: 'Gauss Theorem', value: '∯ F · n dS = ∭ (∇ · F) dV', explanation: 'Surface flux equals volume divergence' }
    ],
    contentSections: [
      {
        heading: '1. Computer Graphics & Physics Engine Connections',
        body: [
          'In 3D game engines and computer vision, normal vector mapping on 3D surfaces relies on calculating gradient vectors of implicit surfaces f(x, y, z) = 0.',
          'Simulations of fluid dynamics (smoke, water, aerodynamics) enforce the divergence-free condition ∇ · u = 0 for incompressible Navier-Stokes equations.'
        ]
      }
    ]
  },

  // --- ENGINEERING PHYSICS ---
  {
    id: 'note-phys-wave-optics',
    subjectId: 'engg-physics',
    title: 'Wave Optics: Thin Film Interference & Newton’s Rings',
    chapter: 'Unit 1: Optics & Wave Mechanics',
    readTime: '8 min read',
    difficulty: 'Core',
    summary: 'Conditions for sustained interference, path differences in thin parallel films, phase reversal on reflection (Stokes’ law), and circular Newton’s Rings fringes.',
    keyConcepts: [
      'Two light waves must have a constant phase difference (coherent sources) to produce visible interference.',
      'Reflecting from a denser medium causes an automatic phase change of π radians (path difference of λ/2).',
      'Constructive interference condition in thin film: 2μt cos(r) = (2n - 1)λ/2.',
      'Newton’s rings fringes are circular because the locus of constant air film thickness between a plano-convex lens and glass plate is a circle.'
    ],
    formulasOrKeywords: [
      { label: 'Optical Path Diff', value: 'Δ = 2μt cos(r) ± λ/2', explanation: 'λ/2 added due to phase jump at denser boundary' },
      { label: 'Newton Dark Ring Dia', value: 'D_n² = 4n R λ', explanation: 'Diameter is proportional to square root of natural numbers' },
      { label: 'Newton Bright Ring Dia', value: 'D_n² = 2(2n - 1) R λ', explanation: 'Diameter proportional to square root of odd numbers' },
      { label: 'Wavelength Formula', value: 'λ = (D_{n+p}² - D_n²) / (4 p R)', explanation: 'Laboratory determination of light wavelength' }
    ],
    contentSections: [
      {
        heading: '1. Mechanism of Interference in Thin Films',
        body: [
          'When light falls on a soap bubble or thin oil film on water, a portion of the wave reflects at the top boundary, while the remainder enters the film and reflects at the bottom boundary.',
          'The two reflected beams travel different distances. Because the film thickness is on the scale of visible light wavelengths (~400nm - 700nm), constructive or destructive interference produces brilliant iridescent rainbow patterns.'
        ]
      }
    ]
  },
  {
    id: 'note-phys-lasers',
    subjectId: 'engg-physics',
    title: 'Lasers, Stimulated Emission & Fibre Optics',
    chapter: 'Unit 2: Modern Optics & Lasers',
    readTime: '8 min read',
    difficulty: 'Core',
    summary: 'Einstein coefficients, absorption vs spontaneous vs stimulated emission, population inversion, optical resonators, and optical fiber numerical aperture.',
    keyConcepts: [
      'LASER: Light Amplification by Stimulated Emission of Radiation.',
      'Three quantum processes: Absorption (E1→E2), Spontaneous Emission (random phase/direction), Stimulated Emission (identical photon emitted in phase).',
      'Population Inversion: Condition where the number of atoms in a metastable excited state (N2) exceeds the ground state (N1).',
      'Optical fibers transmit data by Total Internal Reflection (TIR) when core refractive index n1 > cladding index n2.'
    ],
    formulasOrKeywords: [
      { label: 'Numerical Aperture (NA)', value: 'NA = sin(θ_a) = √(n1² - n2²)', explanation: 'Light-gathering power of optical fiber' },
      { label: 'Acceptance Angle', value: 'θ_a = arcsin(√(n1² - n2²))', explanation: 'Maximum cone angle for total internal reflection' },
      { label: 'Normalized Frequency (V)', value: 'V = (2π a / λ) √(n1² - n2²)', explanation: 'Determines number of propagation modes (single vs multimode)' },
      { label: 'Einstein Relation', value: 'B12 = B21 and A21/B21 = 8πhν³ / c³', explanation: 'Equilibrium relation between spontaneous and stimulated rates' }
    ],
    contentSections: [
      {
        heading: '1. Why Stimulated Emission Creates Coherent Light',
        body: [
          'In stimulated emission, an incident photon of energy hν stimulates an already excited atom to drop to its ground state. The atom releases a secondary photon that matches the original photon in wavelength, phase, direction, and polarization.',
          'By placing this active medium inside an optical resonant cavity with one 100% reflecting mirror and one 99% partially transparent mirror, an intense, unidirectional, highly monochromatic beam builds up.'
        ]
      }
    ]
  },
  {
    id: 'note-phys-semiconductor',
    subjectId: 'engg-physics',
    title: 'Semiconductor Physics & Hall Effect in Computing',
    chapter: 'Unit 4: Solid State Electronics',
    readTime: '9 min read',
    difficulty: 'Intermediate',
    summary: 'Intrinsic vs extrinsic semiconductors, Fermi-Dirac distribution, band gap physics, the Hall Effect, and determining carrier concentration.',
    keyConcepts: [
      'Valence band is filled with electrons; conduction band is empty at 0K. Forbidden energy gap Eg dictates conductivity.',
      'Fermi Energy (Ef) represents the electrochemical potential of electrons at absolute zero.',
      'In an n-type semiconductor, donor dopants push Ef near the conduction band; in p-type, acceptor dopants pull Ef near valence band.',
      'Hall Effect: When a current-carrying conductor is placed in a transverse magnetic field, a perpendicular voltage (Hall voltage Vh) develops.'
    ],
    formulasOrKeywords: [
      { label: 'Hall Coefficient (Rh)', value: 'Rh = 1 / (n · e)', explanation: 'Sign of Rh gives carrier type (+ for holes, - for electrons)' },
      { label: 'Hall Voltage', value: 'Vh = (Rh · I · B) / d', explanation: 'Used to measure magnetic field sensors and carrier density' },
      { label: 'Carrier Mobility', value: 'μ = σ · |Rh|', explanation: 'Conductivity combined with Hall coefficient' },
      { label: 'Mass Action Law', value: 'n · p = n_i²', explanation: 'Holds at thermal equilibrium regardless of doping level' }
    ],
    contentSections: [
      {
        heading: '1. Direct Computing Impact of the Hall Effect',
        body: [
          'Hall sensors are everywhere in computer hardware: brushless DC cooling fans use Hall sensors to track motor spindle revolutions, smartphone flip covers detect closure magnetically, and magnetic compass ICs read Earth’s magnetic field.',
          'Most importantly in solid-state laboratory physics, measuring the sign of Vh is the primary method used to prove whether majority charge carriers are electrons or positive holes.'
        ]
      }
    ]
  },

  // --- ENVIRONMENTAL STUDIES ---
  {
    id: 'note-env-ecosystems',
    subjectId: 'env-studies',
    title: 'Ecosystem Dynamics, Energy Flow & 10% Law',
    chapter: 'Unit 1: Ecosystem Ecology',
    readTime: '7 min read',
    difficulty: 'Core',
    summary: 'Structure of ecosystems, biotic and abiotic components, food chains, food webs, ecological pyramids, and Lindeman’s 10% trophic efficiency rule.',
    keyConcepts: [
      'An ecosystem is a functional ecological unit where living organisms interact with abiotic physical environments.',
      'Energy flow is strictly unidirectional (Solar energy → Producers → Herbivores → Carnivores → Decomposers), while nutrient cycles are cyclic.',
      'Lindeman’s 10% Law: Only roughly 10% of chemical energy is transferred from one trophic level to the next; 90% is dissipated as metabolic heat.',
      'Ecological pyramids represent trophic structures by numbers, biomass, or energy (Pyramid of energy is always upright).'
    ],
    formulasOrKeywords: [
      { label: '10% Law', value: 'E_{n+1} ≈ 0.10 · E_n', explanation: 'Explains why food chains are rarely longer than 4-5 trophic tiers' },
      { label: 'GPP vs NPP', value: 'NPP = GPP - Respiration (R)', explanation: 'Net Primary Productivity is net biomass available to consumers' },
      { label: 'Biomagnification', value: 'Concentration increases up trophic levels', explanation: 'Heavy metals (mercury, lead) and pesticides (DDT)' }
    ],
    contentSections: [
      {
        heading: '1. The 10% Law and Thermodynamic Limits',
        body: [
          'Raymond Lindeman in 1942 showed that when a primary consumer (herbivore) digests plant matter, most energy is consumed by cell respiration, movement, and heat loss.',
          'Because 90% is lost at each step, high-tier carnivores require immense ecological territory to survive. This thermodynamic limitation directly mirrors load balancing and cascading cache overhead in distributed computing.'
        ]
      }
    ]
  },
  {
    id: 'note-env-ewaste',
    subjectId: 'env-studies',
    title: 'E-Waste Hazards & Green Computing in CSE',
    chapter: 'Unit 3: Technological Environmental Impact',
    readTime: '8 min read',
    difficulty: 'Core',
    summary: 'Electronic waste generation rates, toxic constituents (Lead, Mercury, Cadmium, BFRs), RoHS directives, informal recycling hazards, and green software engineering.',
    keyConcepts: [
      'E-waste (Electronic Waste) includes discarded computers, monitors, circuit boards, batteries, and peripherals.',
      'Circuit boards contain hazardous heavy metals: Lead (Pb) in solders, Mercury (Hg) in backlights, and Cadmium (Cd) in SMD resistors.',
      'Open burning of plastic computer cases produces carcinogenic dioxins and furans.',
      'Green Computing focuses on algorithmic efficiency (reducing cloud datacenter CPU cycles and cooling energy) and hardware lifecycle longevity.'
    ],
    formulasOrKeywords: [
      { label: 'RoHS Directive', value: 'Restriction of Hazardous Substances', explanation: 'Bans Pb, Cd, Hg, Cr(VI), PBB, and PBDE in electronics' },
      { label: 'WEEE', value: 'Waste Electrical & Electronic Equipment', explanation: 'Mandates Extended Producer Responsibility (EPR)' },
      { label: 'PUE (Datacenter)', value: 'PUE = Total Facility Energy / IT Equipment Energy', explanation: 'Ideal target is 1.0 (efficient cooling and power systems)' },
      { label: '3R Hierarchy', value: 'Reduce > Reuse > Recycle', explanation: 'Prevention is vastly superior to post-disposal chemical recovery' }
    ],
    contentSections: [
      {
        heading: '1. Why CSE Students Must Understand E-Waste',
        body: [
          'Global electronic waste generation exceeds 60 million metric tons annually. Over 80% is disposed of informally in developing countries, leading to groundwater contamination and severe neurological harm to scrap workers.',
          'As software engineers, design decisions directly impact carbon footprints: inefficient polling loops and bloated scripts force client devices to consume excess power and drain lithium batteries faster, accelerating hardware obsolescence.'
        ]
      }
    ]
  },
  {
    id: 'note-env-climate-policy',
    subjectId: 'env-studies',
    title: 'Climate Change, Carbon Credits & Kyoto/Paris Accords',
    chapter: 'Unit 5: Global Environmental Agreements',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    summary: 'Greenhouse effect, principal GHG gases (CO2, CH4, N2O, CFCs), global warming potentials, the Kyoto Protocol mechanisms, and the Paris Agreement 1.5°C goal.',
    keyConcepts: [
      'The natural greenhouse effect keeps Earth warm; anthropogenic emissions intensify it, driving global warming.',
      'Methane (CH4) has a Global Warming Potential (GWP) ~28 times greater than CO2 over a 100-year window.',
      'Kyoto Protocol introduced binding emission limits and flexible mechanisms: Clean Development Mechanism (CDM) and Carbon Credit Trading.',
      'Paris Agreement (COP21) established the legally binding framework to limit global temperature rises to well below 2°C, aiming for 1.5°C above pre-industrial levels.'
    ],
    formulasOrKeywords: [
      { label: 'Carbon Credit', value: '1 Credit = 1 Metric Ton CO2 equivalent reduced', explanation: 'Tradable certificate under cap-and-trade frameworks' },
      { label: 'Paris Goal', value: '< 1.5°C temperature rise above pre-industrial', explanation: 'Requires net-zero carbon emissions by 2050' },
      { label: 'IPCC', value: 'Intergovernmental Panel on Climate Change', explanation: 'UN body assessing the scientific consensus on climate change' }
    ],
    contentSections: [
      {
        heading: '1. Technology and Renewable Integration',
        body: [
          'Modern tech companies like Google and Microsoft operate on 100% renewable energy matching and track hourly carbon-free energy (CFE).',
          'Intelligent smart grid computing, AI-driven wind turbine load dispatch, and battery management systems (BMS) are major CSE job sectors addressing the climate transition.'
        ]
      }
    ]
  }
];
