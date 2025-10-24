import { useState, useRef, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gridData, setGridData] = useState(
    Array(28)
      .fill(null)
      .map(() => Array(28).fill(0))
  );
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const cellSize = 16; // pixels per grid cell
  const canvasSize = 28 * cellSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw grid
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid lines (optional - can remove for cleaner look)
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 28; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }
  }, []);

  const drawCell = (row, col, ctx) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

    // Update grid data
    const newGrid = [...gridData];
    newGrid[row][col] = 1;
    setGridData(newGrid);
  };

  const getGridPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    return { row, col };
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { row, col } = getGridPosition(e);
    const ctx = canvasRef.current.getContext("2d");
    drawCell(row, col, ctx);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { row, col } = getGridPosition(e);
    if (row >= 0 && row < 28 && col >= 0 && col < 28) {
      const ctx = canvasRef.current.getContext("2d");
      drawCell(row, col, ctx);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Redraw grid lines
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 28; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    setGridData(
      Array(28)
        .fill(null)
        .map(() => Array(28).fill(0))
    );
    setPrediction(null);
    setConfidence(null);
  };

  const predictDrawing = async () => {
    // TODO: Load TensorFlow.js model
    // const model = await tf.loadLayersModel('/model.json');

    // Convert gridData to tensor
    // const tensor = tf.tensor2d(gridData).expandDims(0).expandDims(-1);
    // const prediction = await model.predict(tensor);
    // const probabilities = await prediction.data();
    const mockPrediction = "A";
    const mockConfidence = 0.87;

    setPrediction(mockPrediction);
    setConfidence(mockConfidence);

    console.log("Grid data ready for model:", gridData);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "50vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          height: "100%",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            border: "2px solid #444",
            cursor: "crosshair",
            touchAction: "none",
          }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={predictDrawing}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: "#ffffffff",
              color: "#000000ff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Predict
          </button>

          <button
            onClick={clearCanvas}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: "#e85247ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            color: "#666",
            fontSize: "14px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <p>Draw a digit (0-9) or letter (A-Z, a-z)</p>
        </div>
      </div>

      <div style={{ width: "50%", height: "100%" }}>
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            fontSize: "24px",
          }}
        >
          <div>
            Prediction: <strong>{prediction}</strong>
          </div>
          <div style={{ fontSize: "18px", marginTop: "8px", color: "#aaa" }}>
            Confidence: {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
