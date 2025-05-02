import './App.css';

function App() {
  const boardSize = 10; // 棋盤尺寸
  const cells = Array.from({ length: boardSize * boardSize }, (_, index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // 只保留邊緣格子（上邊、下邊、左邊、右邊）
    if (
      row === 0 || // 上邊
      row === boardSize - 1 || // 下邊
      col === 0 || // 左邊
      col === boardSize - 1 // 右邊
    ) {
      return index + 1; // 返回格子編號
    }
    return null; // 內部格子留空
  });

  return (
    <div>
      {/* 狀態欄 */}
      <div className="status-bar">
        <div className="player-info">
          <img
            src="https://via.placeholder.com/50"
            alt="Player Avatar"
            className="avatar"
          />
          <div className="stats">
            <p>速度: 10</p>
            <p>攻擊: 50</p>
          </div>
        </div>
        <div className="boss-info">
          <p>BOSS 血量: 1000</p>
        </div>
      </div>

      {/* 棋盤 */}
      <div className="board">
        {cells.map((cell, index) =>
          cell ? (
            <div key={index} className="cell">
              {cell}
            </div>
          ) : (
            <div key={index} className="empty-cell" />
          )
        )}
      </div>
    </div>
  );
}

export default App;
