# Internationalization (i18n) Setup

This project has been configured with i18next for internationalization support. The setup includes support for 5 languages: English, Korean, Italian, German, and French.

## Files Structure

```
src/i18n/
├── index.ts              # i18n configuration
├── locales/
│   ├── en.json          # English translations
│   ├── ko.json          # Korean translations
│   ├── it.json          # Italian translations
│   ├── de.json          # German translations
│   └── fr.json          # French translations
└── README.md            # This file
```

## How to Use

### 1. Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
      <p>{t('messages.welcome')}</p>
    </div>
  );
};
```

### 2. Using the Custom Hook

```tsx
import { useTranslations } from '../hooks/useTranslations';

const MyComponent = () => {
  const { t, changeLanguage, getCurrentLanguage } = useTranslations();
  
  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };
  
  return (
    <div>
      <p>Current language: {getCurrentLanguage()}</p>
      <button onClick={() => handleLanguageChange('fr')}>
        {t('language.french')}
      </button>
    </div>
  );
};
```

### 3. Translation Keys Structure

The translation keys are organized in the following structure:

- `common.*` - Common UI elements (buttons, labels, etc.)
- `navigation.*` - Navigation menu items
- `auth.*` - Authentication related text
- `profile.*` - Profile related text
- `drivers.*` - Driver management text
- `payment.*` - Payment related text
- `income.*` - Income related text
- `transaction.*` - Transaction related text
- `disputes.*` - Disputes related text
- `tracking.*` - Tracking related text
- `timeLog.*` - Time logging text
- `charges.*` - Charges related text
- `limits.*` - Limits related text
- `notifications.*` - Notifications text
- `language.*` - Language selection text
- `modals.*` - Modal dialog text
- `status.*` - Status indicators
- `pagination.*` - Pagination text
- `validation.*` - Form validation messages
- `messages.*` - General messages

### 4. Adding New Translations

To add new translations:

1. Add the key to all locale files (`en.json`, `ko.json`, `it.json`, `de.json`, `fr.json`)
2. Use the key in your component with the `t()` function

Example:
```json
// In en.json
{
  "newSection": {
    "newKey": "New Text"
  }
}
```

```tsx
// In your component
const { t } = useTranslation();
return <div>{t('newSection.newKey')}</div>;
```

### 5. Language Switching

The language can be changed using the LanguageTab component or programmatically:

```tsx
import { useTranslations } from '../hooks/useTranslations';

const { changeLanguage } = useTranslations();

// Change to French
changeLanguage('fr');

// Change to Korean
changeLanguage('ko');
```

### 6. Available Languages

- `en` - English
- `ko` - Korean
- `it` - Italian
- `de` - German
- `fr` - French

### 7. Language Persistence

The selected language is automatically saved to localStorage and will be restored when the user returns to the application.

### 8. Fallback Language

If a translation key is missing in the current language, it will fall back to English (`en`).

## Components Updated

The following components have been updated to use translations:

- `LanguageTab.tsx` - Language selection interface
- `Sidebar.tsx` - Navigation menu items
- `GlobalBtn.tsx` - Button component (supports translation keys)

## Notes

- All static text in the application should use translation keys
- The i18n configuration is initialized in `main.tsx`
- Language detection is handled automatically by i18next-browser-languagedetector
- The setup doesn't interfere with existing navigation, UI, or API calls
