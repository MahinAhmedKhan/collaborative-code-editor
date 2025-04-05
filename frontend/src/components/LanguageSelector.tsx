import { LANGUAGE_VERSIONS } from '@/constants';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (lang: string) => void;
}) => {
  return (
    <Box ml={2} mb={4}>
      <Menu isLazy>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {language}
        </MenuButton>
        <MenuList bg='gray.800'>
          {languages.map(([lang, version]) => (
            <MenuItem key={lang}
            color = {
              lang === language ? 'white' : 'gray.400'
            }
            bg = {
              lang === language ? 'gray.700' : 'gray.800'
            }
            _hover={{
              bg: 'gray.700',
            }}
            onClick={() => onSelect(lang)}>
              {lang} {version}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
