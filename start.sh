#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Получаем путь к директории скрипта
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   Православные тесты для детей${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Запускаю локальный веб-сервер...${NC}"
echo ""
echo -e "${GREEN}✓ Сервер запущен!${NC}"
echo ""
echo -e "${BLUE}Откройте в браузере:${NC}"
echo -e "${GREEN}   http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}Для остановки сервера нажмите Ctrl+C${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo ""

# Запускаем Python HTTP сервер
python3 -m http.server 8000

