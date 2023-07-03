import { useEffect, useState, FC } from "react";
import Header from "../components/UI/Header/Header";
import { Container } from "@mui/material";
import LevelsList from "../components/LevelsList/LevelsList";
import AddForm from "../components/AddForm/AddForm";
import { addType } from "../types/enums";
import axiosInstance from "../axiosInstance";
import Grid from "../components/Grid/Grid";

let id = 0

const Main: FC = () => {

  const [addFormValue, setAddFormValue] = useState<IaddForm>({ level: 0, word: '', letter: '' });
  const [levelData, setLevelData] = useState<IlevelData>({ level: 0, words: [], letters: [] });
  const [levels, setLevels] = useState<IlevelResponse[]>([]);
  const [size, setSize] = useState<{ horizontal: number, vertical: number }>({ horizontal: 0, vertical: 0 });
  const [grid, setGrid] = useState<((number | string)[])[]>([]);
  const [editMode, setEditMode] = useState<number>(-1)
  const [currentLetter, setCurrentLetter] = useState<string>('')

  const fetchLevels = async () => {
    const res = await axiosInstance.get('/getLevels')
    setLevels(res.data)
  }

  useEffect(() => {
    fetchLevels()
  }, [])

  console.log(levels)

  const onChangeAddForm = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (name === 'level') {
      setAddFormValue((prevValue) => {
        return { ...prevValue, [name]: Number(value) }
      })
    } else {
      if (name === 'letter' && value.length > 1) {
        setAddFormValue((prevValue) => {
          return { ...prevValue, [name]: value[1] }
        })
        return
      }
      setAddFormValue((prevValue) => {
        return { ...prevValue, [name]: value }
      })
    }
  }

  useEffect(() => {
    const arr: (number[])[] = []
    for (let i = 0; i < size.vertical; i++) {
      const row: number[] = []
      arr.push(row)
      for (let j = 0; j < size.horizontal; j++) {
        row.push(0);
      }
    }
    setGrid([...arr])
  }, [size.vertical, size.horizontal])


  const onChangeSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    if (Number(value) < 0) return
    if (Number(value) < 13) {
      setSize((prevValue) => {
        return { ...prevValue, [name]: Number(value) }
      })
    } else {
      setSize((prevValue) => {
        return { ...prevValue, [name]: 12 }
      })
    }
  }

  const addElement = (type: addType): void => {
    switch (type) {
      case addType.LEVEL:
        setLevelData((prevValue) => {
          return { ...prevValue, level: addFormValue.level }
        })
        setAddFormValue((prevValue) => {
          return { ...prevValue, level: 0 }
        })
        break;
      case addType.LETTERS:
        setLevelData((prevValue) => {
          return { ...prevValue, letters: [...prevValue.letters, { letter: addFormValue.letter.toLowerCase(), id: id++ }] }
        })
        setAddFormValue((prevValue) => {
          return { ...prevValue, letter: '' }
        })
        break;
      case addType.WORDS:
        setLevelData((prevValue) => {
          const word = addFormValue.word.toLowerCase();
          const updatedLetters = [...prevValue.letters];

          for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            if (!updatedLetters.some(item => item.letter === letter)) {
              updatedLetters.push({ letter: letter, id: id++ });
            }
          }

          return {
            ...prevValue,
            words: [...prevValue.words, { word: addFormValue.word.toLowerCase(), id: id++ }],
            letters: updatedLetters
          }
        })
        setAddFormValue((prevValue) => {
          return { ...prevValue, word: '' }
        })
        break;
    }
  }

  const deleteElement = (type: addType, id?: number): void => {
    switch (type) {
      case addType.LEVEL:
        setLevelData((prevValue) => {
          return { ...prevValue, level: 0 }
        })
        break;
      case addType.LETTERS:
        setLevelData((prevValue) => {
          const index = prevValue.letters.findIndex(el => id === el.id)
          prevValue.letters.splice(index, 1)
          return { ...prevValue, letters: prevValue.letters }
        })
        break;
      case addType.WORDS:
        setLevelData((prevValue) => {
          const index = prevValue.words.findIndex(el => id === el.id)
          prevValue.words.splice(index, 1)
          return { ...prevValue, words: prevValue.words }
        })
        break;
    }
  }

  const postLevel = async (): Promise<void> => {
    const words = levelData.words.map((el) => {
      return el.word
    })
    const letters = levelData.letters.map((el) => {
      return el.letter
    })
    let data
    if (grid.length > 0) {
      data = { data: JSON.stringify({ level: levelData.level, words: words, letters: letters, config: grid }) }
    } else {
      data = { data: JSON.stringify({ level: levelData.level, words: words, letters: letters }) }
    }
    if (editMode > -1) {
      await axiosInstance.post('/editLevel', { ...data, id: editMode })
      setEditMode(-1)
    } else {
      await axiosInstance.post('/addLevel', data)
    }
    setLevelData(() => {
      return {
        level: 0,
        words: [],
        letters: [],
      }
    })
    setGrid([])
    setSize({vertical: 0, horizontal: 0})
    fetchLevels()
  }

  const deleteLevel = async (id: number): Promise<void> => {
    const data = { id: id }
    await axiosInstance.post('/deleteLevel', data)
    fetchLevels()
  }

  const turnOnEditMode = (id: number): void => {
    setEditMode(id)
    const findElement = levels.find(el => el.id === id) as IlevelResponse
    const data = JSON.parse(findElement?.data)
    
    setLevelData(
      {
        level: data.level,
        words: data.words.map((el: string) => { return { id: id++, word: el } }),
        letters: data.letters.map((el: string) => { return { id: id++, letter: el } })
      }
    )
    if (data.config) {
      setGrid(data.config)
    }

  }

  const turnOffEditMode = (): void => {
    setEditMode(-1)
    setLevelData(
      {
        level: 0,
        words: [],
        letters: []
      }
    )
    setGrid([])
    setSize({vertical: 0, horizontal: 0})
  }



  return (
    <>
      <Header />
      <Container maxWidth={false} sx={{ padding: '0 60px', display: 'flex', gap: '70px' }}>
        <LevelsList levels={levels} deleteLevel={deleteLevel} turnOnEditMode={turnOnEditMode} />
        <AddForm
          onChangeAddForm={onChangeAddForm}
          addFormValue={addFormValue}
          addElement={addElement}
          levelData={levelData}
          deleteElement={deleteElement}
          postLevel={postLevel}
          editMode={editMode}
          turnOffEditMode={turnOffEditMode}
          setCurrentLetter={setCurrentLetter}
          currentLetter={currentLetter}
        />
        <Grid
          size={size}
          onChangeSize={onChangeSize}
          grid={grid}
          setCurrentLetter={setCurrentLetter}
          currentLetter={currentLetter}
          setGrid={setGrid}
        />
      </Container>
    </>
  )
};

export default Main
