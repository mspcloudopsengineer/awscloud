import React from "react";
import { Box, Card, CardContent, Typography, List, ListItemButton, ListItemText, ListItemIcon, Chip, Alert } from "@mui/material";
import { Language, Check, Info } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "./useLanguage";

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <Language sx={{ mr: 1 }} />
          <FormattedMessage id="languageSettings.title" defaultMessage="Language Settings" />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <FormattedMessage id="languageSettings.description" defaultMessage="Select the interface display language. Changes take effect after page reload." />
        </Typography>
        <Alert severity="info" icon={<Info />} sx={{ mb: 2 }}>
          <FormattedMessage
            id="languageSettings.note"
            defaultMessage="Currently only English (US) has full translation support. Other languages will use English as fallback."
          />
        </Alert>
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
              {currentLanguage === lang.code && (
                <Chip label={<FormattedMessage id="current" defaultMessage="Current" />} size="small" color="primary" />
              )}
              {lang.code === "en-US" && currentLanguage !== lang.code && (
                <Chip label={<FormattedMessage id="fullSupport" defaultMessage="Full Support" />} size="small" variant="outlined" color="success" />
              )}
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;
