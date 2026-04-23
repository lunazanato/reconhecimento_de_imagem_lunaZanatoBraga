# Explicação dos Erros no Código

## Erros Identificados

### 1. Linha 4 - Falta de aspas na string de prompt
```python
item1 = float(input(Preço do item 1? ))
```
**Problema:** A string `"Preço do item 1?"` está sem aspas, causando erro de sintaxe.  
**Correção:** Adicionar as aspas: `float(input("Preço do item 1? "))`

---

### 2. Linha 27 - Conversão de tipo ausente
```python
desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))
```
**Problema:** O `input()` retorna uma **string**, mas está sendo usado em cálculos matemáticos na linha seguinte.  
**Correção:** Converter para `float()`: `desconto_cupom = float(input("..."))`

---

### 3. Linha 28 - Cálculo com string
```python
desconto = subtotal * (desconto_cupom / 100)
```
**Problema:** `desconto_cupom` é uma string neste ponto, então a divisão não funciona corretamente.  
**Correção:** Converter `desconto_cupom` para `float` antes do cálculo.

---

### 4. Linha 35 - Falta o 'f' na string formatada
```python
print(" Item 2:        R$ {total_item2:.2f}")
```
**Problema:** Falta o `f` antes das aspas para ser uma f-string, então as variáveis não são interpretadas.  
**Correção:** `print(f" Item 2:        R$ {total_item2:.2f}")`

---

### 5. Linha 41 - Comparação de string com número
```python
if desconto_cupom > 0:
```
**Problema:** `desconto_cupom` é uma string, não pode ser comparada diretamente com um número.  
**Correção:** Converter para `float` antes da comparação.

---

### 6. Linha 42 - Indentação incorreta
```python
print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")
```
**Problema:** A linha está sem indentação (deve estar dentro do `if`).  
**Correção:** Adicionar indentação de 4 espaços.

---

## Resumo das Correções

| Linha | Erro | Correção |
|-------|------|----------|
| 4 | Aspas ausentes no prompt | `"Preço do item 1? "` |
| 27 | String sem conversão | `float(input(...))` |
| 28 | Cálculo com string | Já corrigido na linha 27 |
| 35 | Falta 'f' na f-string | `f" Item 2:..."` |
| 41 | Comparação string vs número | Converter para float |
| 42 | Indentação ausente | Adicionar 4 espaços |