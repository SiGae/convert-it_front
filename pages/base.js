/*
 * Base converter page
 */
import React, { useState } from 'react';
import axios from 'axios';

// Material UI components
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import { TypoStyle, ButtonStyle, FormStyle } from '../components/Styles';
import copyResult from '../modules/Clipboard';

const bases = [
  {
    id: 0,
    value: 2,
    label: '2',
    link: 'bin',
  },
  {
    id: 1,
    value: 8,
    label: '8',
    link: 'oct',
  },
  {
    id: 2,
    value: 10,
    label: '10',
    link: 'dec',
  },
  {
    id: 3,
    value: 16,
    label: '16',
    link: 'hex',
  },
];
const baseValue = [2, 8, 10, 16];

const Base = () => {
  // states
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState('0');
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(16);
  const [error, setError] = useState(false);

  // API request
  const convert = () => {
    let data = input.replace(' ', '').split(',');
    let isError = false;
    const uri = `${process.env.NEXT_PUBLIC_API_URI}/upload/radix/${
      bases[baseValue.findIndex((element) => element === from)].link
    }`;
    setInput(input.replace(' ', ''));
    if (from === 10) {
      try {
        data = data.map((str) => parseInt(str, 10));
      } catch (e) {
        isError = true;
      }
    }
    if (!isError) {
      axios({
        method: 'post',
        url: uri,
        data: {
          to_type: bases[baseValue.findIndex((element) => element === to)].link,
          data,
        },
      })
        .then((response) => {
          setError(false);
          const res = response.data;
          setOutput(res[0].data.output.join(', '));
        })
        .catch(() => {
          setError(true);
        });
    }
  };

  return (
    <FormStyle>
      <div className="item">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="base-converter-input-label">입력 선택</InputLabel>
            <Select
              labelId="base-converter-input-selector-label"
              id="base-converter-input-selector"
              value={from}
              label="입력 선택"
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            >
              {bases
                .filter((item) => item.value !== to)
                .map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.value}
                  >{`${item.label}진법`}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="base-converter-output-label">출력 선택</InputLabel>
            <Select
              labelId="base-converter-output-selector-label"
              id="base-converter-output-selector"
              value={to}
              label="입력 선택"
              onChange={(e) => {
                setTo(e.target.value);
              }}
            >
              {bases
                .filter((item) => item.value !== from)
                .map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.value}
                  >{`${item.label}진법`}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <TextField
          label="변환할 값"
          helperText="변환할 값을 쉼표로 구분하여 입력"
          multiline
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        {error ? <TypoStyle error>입력을 확인해 주세요.</TypoStyle> : null}
        <ButtonStyle>
          <Button
            variant="outlined"
            onClick={() => {
              convert();
            }}
          >
            변환!
          </Button>
        </ButtonStyle>
      </div>
      <div className="item">
        <TypoStyle>변환 결과</TypoStyle>
        <TypoStyle description>
          {output !== null ? output : '결과가 여기에 표시됩니다.'}
        </TypoStyle>
        {output !== null ? (
          <ButtonStyle>
            <Button
              variant="outlined"
              onClick={() => {
                copyResult(output);
              }}
            >
              결과 복사
            </Button>
          </ButtonStyle>
        ) : null}
      </div>
    </FormStyle>
  );
};

export default Base;
