import { Button, Typography, Box, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { FC } from 'react';
import { addType } from '../../types/enums';
import List from '@mui/material/List';
import DeleteIcon from '@mui/icons-material/Delete';


interface IAddFormProps {
  addFormValue: IaddForm;
  onChangeAddForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addElement: (type: addType) => void;
  deleteElement: (type: addType, id: number) => void
  levelData: IlevelData
  postLevel: () => Promise<void>
  turnOffEditMode: () => void
  editMode: number
  currentLetter: string
  setCurrentLetter: React.Dispatch<React.SetStateAction<string>>
}

const AddForm: FC<IAddFormProps> = ({ addFormValue, onChangeAddForm, addElement, levelData, deleteElement, postLevel, turnOffEditMode, editMode, setCurrentLetter }) => {

  const checkEditMode = editMode > -1
  const dragStart = (letter: string) => {
    setCurrentLetter(letter)
  }

  return (
    <Box sx={{ flexBasis: '25%' }}>
      <Typography
        sx={{ display: 'inline' }}
        component="span"
        variant="h3"
        textAlign='center'
      >
        {checkEditMode ? 'Редактировать уровень' : 'Добавить уровень'}
      </Typography>
      <Box sx={{ marginTop: '30px' }}>

        <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <TextField
            id="outlined-words"
            label="Уровень"
            value={addFormValue.level}
            name='level'
            type='number'
            onChange={onChangeAddForm}
          />
          <Button disabled={!addFormValue.level} variant="contained" endIcon={<SendIcon />} onClick={() => { addElement(addType.LEVEL) }}>
            Добавить
          </Button>
        </Box>


        <List sx={{ marginBottom: '30px' }}>
          {levelData.level ? <Box
            key={levelData.level}
            sx={{ border: '1px solid black', borderRadius: '15px', padding: '5px', display: 'flex', alignItems: 'center', width: '100px', justifyContent: 'space-between' }}
          >
            <Typography
              sx={{ display: 'inline', fontSize: '20px', lineHeight: '10px' }}
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              <b>{levelData.level}</b>
            </Typography>
            <IconButton aria-label="delete" onClick={() => { deleteElement(addType.LEVEL, 0) }}>
              <DeleteIcon />
            </IconButton>
          </Box> : null}
        </List>


        <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <TextField
            id="outlined-words"
            label="Слова"
            value={addFormValue.word}
            name='word'
            onChange={onChangeAddForm}
          />
          <Button variant="contained" disabled={!addFormValue.word} endIcon={<SendIcon />} onClick={() => { addElement(addType.WORDS) }}>
            Добавить
          </Button>
        </Box>

        <List sx={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {levelData.words.length > 0 ?
            levelData.words.map((word) => {
              return (<Box
                sx={{ border: '1px solid black', borderRadius: '15px', padding: '5px', display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'space-between' }}
                key={word.id}
              >
                <Typography
                  sx={{ display: 'inline', fontSize: '20px', lineHeight: '10px' }}
                  component="span"
                  variant="subtitle1"
                  color="text.primary"
                >
                  <b>{word.word}</b>
                </Typography>
                <IconButton aria-label="delete" onClick={() => { deleteElement(addType.WORDS, word.id) }}>
                  <DeleteIcon />
                </IconButton>
              </Box>)
            })
            : null}
        </List>

        <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <TextField
            id="outlined-letters"
            label="Буквы"
            value={addFormValue.letter}
            name='letter'
            onChange={onChangeAddForm}
          />
          <Button variant="contained" disabled={!addFormValue.letter} endIcon={<SendIcon />} onClick={() => { addElement(addType.LETTERS) }}>
            Добавить
          </Button>
        </Box>

        <List sx={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {levelData.letters.length > 0 ?
            levelData.letters.map((letter) => {
              return (<Box
                draggable={true}
                onDragStart={() => { dragStart(letter.letter) }}
                sx={{ border: '1px solid black', borderRadius: '15px', padding: '10px', display: 'flex', alignItems: 'center', width: '70px', justifyContent: 'space-between' }}
                key={letter.id}
              >
                <Typography
                  sx={{ display: 'inline', fontSize: '20px', lineHeight: '10px' }}
                  component="span"
                  variant="subtitle1"
                  color="text.primary"
                >
                  <b>{letter.letter}</b>
                </Typography>
                <IconButton aria-label="delete" onClick={() => { deleteElement(addType.LETTERS, letter.id) }}>
                  <DeleteIcon />
                </IconButton>
              </Box>)
            })
            : null}
        </List>
      </Box>

      <Button
        variant="contained"
        color="success"
        sx={{ padding: '10px', fontSize: '18px' }}
        disabled={!levelData.level || levelData.letters.length === 0 || levelData.words.length === 0}
        onClick={postLevel}
      >
        {checkEditMode ? 'Редактировать уровень' : 'Добавить уровень'}
      </Button>
      {checkEditMode ? <Button
        variant="contained"
        color="secondary"
        sx={{ padding: '10px', fontSize: '18px', marginLeft: '20px' }}
        disabled={!levelData.level || levelData.letters.length === 0 || levelData.words.length === 0}
        onClick={turnOffEditMode}
      >
        Сброс
      </Button> : null}
    </Box>
  );
}

export default AddForm