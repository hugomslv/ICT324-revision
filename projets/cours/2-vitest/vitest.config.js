// vitest.config.js
import { defineConfig, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: false, // activer la couverture
      provider: 'v8', // provider de couverture
      // Inclure seulement le code source applicatif (inclut aussi les fichiers non-importés)
      include: ['src/**/*.{js,cjs,mjs,jsx}'],
      // Exclure des sous-ensembles spécifiques du scope ci-dessus
      exclude: [
        'src/docs/**',
        'src/**/__mocks__/**',
        'src/vendor/**',
        '**/*.d.ts',
        '**/*.min.*',
        '**/*.config.*',
        // conserver les exclusions par défaut et ajouter les vôtres
        ...coverageConfigDefaults.exclude,
      ],
      reporter: ['json', 'html', 'text'],
      reportsDirectory: './coverage'
    },
  },
})
