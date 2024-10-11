import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

type SearchBarProps = {
  placeholder: string,
  action: (searchString: string) => Promise<string> | string,
  hideOnXS?: boolean,
};

const SearchBar = ({ placeholder, action, hideOnXS }: SearchBarProps) => {
  const [searchString, setSearchString] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const redirectAction = (url: string) => {
    if (url.startsWith('http' || 'www')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
    setSearchString('');
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const result = action(searchString);
      if (typeof result === 'string') {
        redirectAction(result);
      } else {
        setSearching(true);
        result.then((url) => {
          redirectAction(url);
          setSearching(false);
        });
      }
    }
  };
  return (
    <Search sx={hideOnXS ? { display: { xs: 'none', md: 'flex' } } : undefined}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        onKeyPress={handleEnter}
        onChange={(e) => { setSearchString(e.target.value); }}
        value={searchString}
        disabled={searching}
      />
    </Search>
  );
};

export default SearchBar;
