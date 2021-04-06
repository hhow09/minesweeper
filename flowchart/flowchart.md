### Generate the flow chart using [Mermaid.js Live Editor](https://mermaid-js.github.io/mermaid-live-editor/)

### Prepare Board

```
graph TD
    subgraph Prepare Board
        1A[Create Board Matrix]
        1B[Place Bombes]
        1D{{Start Game}}
        1A --> 1B
        1B --Update BombCount of adjacent Cells--> 1B
        1B --> 1D
    end
```

### Click A Cell

```
graph TD
    subgraph Click A Cell
        2A{right click?}
        2B[Flag/Unflag the cell]
        2C{first click?}
        2D{is mine?}
        2D2{is mine?}
        2E[Modify cell into normal]
        2F[Find adjacent safe Cells]
        2G{{Fail the Game}}
        2H[Set found Safe Cells open]
        2I[normal cell]
        2J{0 adjacent mines?}
        2K[Open Single Cell]
        2A -- Yes --> 2B
        2A -- No --> 2C
        2C -- Yes --> 2D
        2D --Yes--> 2E -->2I
        2D -- No --> 2I

        2C -- No --> 2D2
        2D2 -- Yes --> 2G
        2D2 -- No --> 2I

        2I --> 2J
        2J --No--> 2K
        2J --Yes--> 2F
        2F --DFS--> 2F
        2F --Update opened cell count--> 2H

        style 2G fill:#FF9A9A, stroke:#FF9A9A
        style 2K fill:#b5fca7, stroke:#b5fca7
    end
```

### Check Board Status

```
graph TD
    subgraph Check Board Status
        3A[Board State Change]
        3B{All safe cells opened ?}
        3C{{Win the game}}
        3D[Do nothing]
        3A --> 3B --Yes--> 3C
        3B --No-->3D

        style 3C fill:#9FFF9D,stroke:#9FFF9D,stroke-width:4px
        style 3D stroke-dasharray: 5 5
    end
```
