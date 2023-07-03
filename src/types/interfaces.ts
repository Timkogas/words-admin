interface Iletter {
  id: number
  letter: string
}

interface Iword {
  word: string
  id: number
}


interface IaddForm {
  level: number
  word: string
  letter: string
}

interface IlevelData {
  level: number
  words: Iword[]
  letters: Iletter[]
  config?: ((number|string)[])[]
}

interface IlevelResponse{
  id: number
  data: string
}

