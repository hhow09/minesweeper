### Generate the flow chart using [Mermaid.js Live Editor](https://mermaid-js.github.io/mermaid-live-editor/)

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
    subgraph Click A Cell
        2A{right click?}
        2B[Flag the cell]
        2C{first cell?}
        2D{is bomb?}
        2D2{is bomb?}
        2E[Modify cell into normal]
        2F[Find adjacent safe Cells]
        2G{{Fail the Game}}
        2H[Set found Safe Cells open]
        2A -- Yes --> 2B
        2A -- No --> 2C
        2C -- Yes --> 2D
        2D --Yes--> 2E -->2F
        2D -- No --> 2F

        2C -- No --> 2D2
        2D2 -- Yes --> 2G
        2D2 -- No --> 2F

        2F --DFS--> 2F
        2F --> 2H

        style 2G fill:#FF9A9A, stroke:#FF9A9A,stroke-width:4px
    end
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
