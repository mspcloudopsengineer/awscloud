import React from 'react';
import { Box, Card, CardContent, Typography, List, ListItemButton, ListItemText, ListItemIcon, Chip } from '@mui/material';
import { Language, Check } from '@mui/icons-material';
import { useLanguage } from './useLanguage';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Language sx={{ mr: 1 }} /> 语言设置
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          选择界面显示语言。更改后将立即生效。
        </Typography>
        <List>
          {languages.map((lang) => (
            <ListItemButton
              key={lang.code}
              selected={currentLanguage === lang.code}
              onClick={() => changeLanguage(lang.code)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              {currentLanguage === lang.code && (
                <ListItemIcon sx={{ minWidth: 36 }}><Check color="primary" /></ListItemIcon>
              )}
              <ListItemText
                primary={lang.nativeLabel}
                secondary={lang.label}
                inset={currentLanguage !== lang.code}
              />
              {currentLanguage === lang.code && <Chip label="当前" size="small" color="primary" />}
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;
