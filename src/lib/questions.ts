export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number; // 1-10
};

export const questions: Question[] = [
  {
    id: 1,
    question: '¿Cuál es la capital de Australia?',
    options: ['Sídney', 'Melbourne', 'Canberra', 'Perth'],
    correctAnswer: 'Canberra',
    difficulty: 4,
  },
  {
    id: 2,
    question: '¿En qué año llegó el hombre a la Luna?',
    options: ['1965', '1969', '1972', '1981'],
    correctAnswer: '1969',
    difficulty: 3,
  },
  {
    id: 3,
    question: '¿Quién escribió "Cien años de soledad"?',
    options: ['Mario Vargas Llosa', 'Julio Cortázar', 'Gabriel García Márquez', 'Pablo Neruda'],
    correctAnswer: 'Gabriel García Márquez',
    difficulty: 2,
  },
  {
    id: 4,
    question: '¿Cuál es el río más largo del mundo?',
    options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'],
    correctAnswer: 'Amazonas',
    difficulty: 6,
  },
  {
    id: 5,
    question: '¿Qué elemento químico tiene el símbolo "Ag"?',
    options: ['Oro', 'Plata', 'Argón', 'Arsénico'],
    correctAnswer: 'Plata',
    difficulty: 5,
  },
  {
    id: 6,
    question: '¿Quién pintó la Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Miguel Ángel'],
    correctAnswer: 'Leonardo da Vinci',
    difficulty: 1,
  },
  {
    id: 7,
    question: '¿Cuál es el océano más grande del mundo?',
    options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
    correctAnswer: 'Pacífico',
    difficulty: 2,
  },
  {
    id: 8,
    question: '¿En qué continente se encuentra Egipto?',
    options: ['Asia', 'Europa', 'África', 'Oceanía'],
    correctAnswer: 'África',
    difficulty: 1,
  },
  {
    id: 9,
    question: '¿Cuál es la montaña más alta del mundo?',
    options: ['K2', 'Kangchenjunga', 'Lhotse', 'Everest'],
    correctAnswer: 'Everest',
    difficulty: 3,
  },
  {
    id: 10,
    question: '¿Qué país tiene más husos horarios?',
    options: ['Rusia', 'Estados Unidos', 'Canadá', 'Francia'],
    correctAnswer: 'Francia',
    difficulty: 8,
  },
  {
    id: 11,
    question: '¿Cuál es el libro más vendido de la historia?',
    options: ['Don Quijote de la Mancha', 'La Biblia', 'El Señor de los Anillos', 'El Principito'],
    correctAnswer: 'La Biblia',
    difficulty: 5,
  },
  {
    id: 12,
    question: '¿Cuál es la velocidad de la luz?',
    options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
    correctAnswer: '300,000 km/s',
    difficulty: 7,
  },
  {
    id: 13,
    question: '¿Cuál fue el primer metal que el hombre empleó?',
    options: ['Hierro', 'Bronce', 'Cobre', 'Oro'],
    correctAnswer: 'Cobre',
    difficulty: 9,
  },
  {
    id: 14,
    question: '¿Cuál es el país más pequeño del mundo?',
    options: ['Mónaco', 'Nauru', 'Tuvalu', 'Vaticano'],
    correctAnswer: 'Vaticano',
    difficulty: 4,
  },
  {
    id: 15,
    question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
    options: ['206', '201', '212', '198'],
    correctAnswer: '206',
    difficulty: 3,
  },
];
