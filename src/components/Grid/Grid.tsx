import { Box, TextField, Typography } from '@mui/material';
import { FC } from 'react';

interface IAddFormProps {
  size: { horizontal: number, vertical: number };
  onChangeSize: (event: React.ChangeEvent<HTMLInputElement>) => void;
  grid: ((number | string)[])[]
  currentLetter: string
  setCurrentLetter: React.Dispatch<React.SetStateAction<string>>
  setGrid: React.Dispatch<React.SetStateAction<((number | string)[])[]>>
}

const Grid: FC<IAddFormProps> = ({ size, onChangeSize, grid, currentLetter, setCurrentLetter, setGrid }) => {


  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const onDelete = (indexVer: number, indexHor: number) => {
    const copyArr = [...grid]
    copyArr[indexVer][indexHor] = 0
    setGrid(copyArr)
  }

  const handleDrop = (event: any, indexVer: number, indexHor: number) => {
    event.preventDefault();
    grid[indexVer][indexHor] = currentLetter
    setCurrentLetter('')
  };

  return (<Box sx={{ flexBasis: '33%' }}>
    <Typography
      sx={{ display: 'inline' }}
      component="span"
      variant="h3"
      textAlign='center'
    >
      Сетка
    </Typography>
    <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
      <TextField
        id="outlined-horizontal"
        label="Горизонталь"
        name='horizontal'
        value={size.horizontal}
        type='number'
        onChange={onChangeSize}
      />
      <TextField
        id="outlined-vertical"
        label="Вертикаль"
        name='vertical'
        value={size.vertical}
        type='number'
        onChange={onChangeSize}
      />
    </Box>
    <Box sx={{ width: '100%', minHeight: '70vh', border: '3px solid black', borderRadius: '5px', padding: '15px' }}>

      {grid.map((element, index) => (
        <Box key={index} sx={{ display: 'flex', padding: '7px', gap: '5px' }} >
          {element.map((number, i) => {
            return (<Box key={i} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index, i)}
              sx={{ border: '2px solid black', fontSize: '21px', display: 'flex', padding: '3px', flexBasis: `${100 / element.length}%`, justifyContent: 'center', textTransform: 'uppercase' }}>
              {number === 0 ? number
                : <> <b>
                  {number}
                </b>
                  <Typography onClick={() => { onDelete(index, i) }} sx={{cursor: 'pointer', marginLeft: '5px'}}>-</Typography>
                </>}
            </Box>)
          })}
        </Box>
      ))}

    </Box>
  </Box>);
}

export default Grid