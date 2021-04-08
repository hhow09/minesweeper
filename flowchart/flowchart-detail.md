## Conditions

### First Click && is mine && adjacentMines==0

```
graph LR
    subgraph Condition: First Click && is mine && adjacentMines==0
        A1[State]
        A2[NewState]
        A3[Update opened count]
        A1 --> P1

        subgraph Pipe
            P1[modify into normal cell]
            P2[update adjacent mine count]
            P3[openAdjacentSafeCells]
            P4[get opened count]
            P1 --> P2 --> P3 --> P4
        end
        P4 --> A2 --> A3
    end
```

### First Click && is mine && adjacentMines>0

```
graph LR
    subgraph Condition: First Click && is mine && adjacentMines>0
        A1[State]
        A2[newState]
        A3[opened count++]
        A1 --> P1

        subgraph Pipe
            P1[modify into normal cell]
            P2[update adjacent mine count]
            P3[open single cell]
            P1 --> P2 --> P3
        end
        P3 --> A2 --> A3
    end
```

### Normal cell && adjacentMines==0

```
graph LR
    subgraph Condition: Normal cell && adjacentMines==0
        A1[State]
        A2[newState]
        A3[Update opened count]
        A1 --> P1

        subgraph Pipe
            P1[openAdjacentSafeCells]
            P2[get opened count]
            P1 --> P2
        end
        P2 --> A2 --> A3
    end
```

### Normal cell && adjacentMines>0

```
graph LR
    subgraph Condition: Normal cell && adjacentMines>0
        A1[State]
        A2[newState]
        A3[opened count++]

        subgraph Pipe
            P1[open single cell]
        end
        A1 --> P1 --> A2 --> A3
    end
```

### Not first Click && is mine

```
graph LR
    subgraph Condition: Not first Click && is mine
        A1[State]
        A2[newState]
        A3{{Fail game}}

        subgraph Pipe
            P1[open a bomb]
        end

        A1 --> P1 -->A2 --> A3
        style A3 fill:#FF9A9A, stroke:#FF9A9A
    end
```
