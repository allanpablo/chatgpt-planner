// tailwind.config.js
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}", // Garante que o Tailwind detecte todos os arquivos em src/
  "./pages/**/*.{js,ts,jsx,tsx}", // Para a estrutura de páginas tradicionais do Next.js
  "./components/**/*.{js,ts,jsx,tsx}", // Para a pasta de componentes
  "./app/**/*.{js,ts,jsx,tsx}", // Para a estrutura do diretório app/ se você estiver usando
];
export const theme = {
  extend: {},
};
export const plugins = [];
