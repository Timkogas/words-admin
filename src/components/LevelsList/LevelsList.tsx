import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { FC } from 'react'


interface IAddFormProps {
  levels: IlevelResponse[]
  deleteLevel: (id: number) => Promise<void>
  turnOnEditMode: (id: number) => void
}


const LevelsList: FC<IAddFormProps> = ({ levels, deleteLevel, turnOnEditMode }) => {
  return (
    <Box sx={{ flexBasis: '33%' }}>
      <Typography
        sx={{ display: 'inline' }}
        component="span"
        variant="h3"
        textAlign='center'
      >
        Уровни
      </Typography>
      <List sx={{ width: '100%', overflowY: 'scroll', height: '80vh', border: '3px solid black', borderRadius: '5px', padding: '15px' }}>
        {levels.map((level) => {
          const data = JSON.parse(level.data)
          const words = data.words.map((word: string) => word.toLowerCase())
          const letters = data.letters.map((letter: string) => letter.toUpperCase())
          const levelString = `Уровень ${data.level}`
          return (
            <React.Fragment key={level.id}>
              <ListItem  alignItems="flex-start" sx={{ border: '1px solid black', borderRadius: '15px' }}>
                <ListItemText
                  primary={levelString}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline', fontSize: '20px', lineHeight: '10px' }}
                        component="span"
                        variant="subtitle1"
                        color="text.primary"
                      >
                        Слова: <b>{words.join(', ')}</b>
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: 'inline', fontSize: '20px' }}
                        component="span"
                        variant="subtitle1"
                        color="text.primary"
                      >
                        Буквы: <b>{letters.join(', ')}</b>
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: 'inline', fontSize: '20px' }}
                        component="span"
                        variant="subtitle1"
                        color="text.primary"
                      >
                        Сетка:  <b>{data?.config?.length > 0 ?  'есть' : 'нет'}</b>
                      </Typography>
                    </>
                  }
                />
                <IconButton aria-label="edit" onClick={() => { turnOnEditMode(level.id) }}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => { deleteLevel(level.id) }}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Box sx={{ m: 2 }} />
            </React.Fragment>)
        })}

      </List>
    </Box>);
}

export default LevelsList