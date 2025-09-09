import { useRef, useState, useEffect } from "react";

export default function App() {
  const canvasRef = useRef(null);
  const [template, setTemplate] = useState(null);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [prize, setPrize] = useState("");

  // Default coordinates
  const [coords, setCoords] = useState({
    nameX: 615,
    nameY: 793,
    eventX: 670,
    eventY: 887,
    dateX: 230,
    dateY: 982,
    prizeX: 1058,
    prizeY: 981,
  });

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setTemplate(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const drawCertificate = () => {
    if (!template) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = template;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#124170";
    ctx.font = "30px Times New Roman";
    ctx.textAlign = "left";

     ctx.fillText(String(name || "").toUpperCase(), coords.nameX, coords.nameY);
ctx.fillText(String(event || "").toUpperCase(), coords.eventX, coords.eventY);
ctx.fillText(String(date || "").toUpperCase(), coords.dateX, coords.dateY);
ctx.fillText(String(prize || "").toUpperCase(), coords.prizeX, coords.prizeY);

    };
  };

  useEffect(() => {
    drawCertificate();
  }, [template, name, event, date, prize, coords]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const fileName = name.trim() !== "" ? `${name}.png` : "certificate.png";
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const updateCoord = (field, value) => {
    setCoords((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  return (
    <div style={{ 
      fontFamily: 'Georgia, "Times New Roman", serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #d4d4d4',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#2c3e50',
          letterSpacing: '1px'
        }}>
          Certificate Generator
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '16px',
          color: '#7f8c8d',
          fontStyle: 'italic'
        }}>
          Single certificate creation tool
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Left Panel - Controls */}
        <div style={{ flex: '0 0 400px', minWidth: '300px' }}>
          {/* File Upload Section */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #d4d4d4',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 15px 0',
              fontSize: '20px',
              color: '#2c3e50',
              borderBottom: '2px solid #ecf0f1',
              paddingBottom: '8px'
            }}>
              Upload Template
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleTemplateUpload}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            />

            {template && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#d5f4e6',
                border: '1px solid #27ae60',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#27ae60'
              }}>
                ✓ Template loaded successfully
              </div>
            )}
          </div>

          {/* Certificate Details Section */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #d4d4d4',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 15px 0',
              fontSize: '20px',
              color: '#2c3e50',
              borderBottom: '2px solid #ecf0f1',
              paddingBottom: '8px'
            }}>
              Certificate Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#34495e'
                }}>
                  Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#34495e'
                }}>
                  Event:
                </label>
                <input
                  type="text"
                  placeholder="Enter event"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#34495e'
                }}>
                  Date:
                </label>
                <input
                  type="text"
                  placeholder="Enter date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#34495e'
                }}>
                  Prize/Award:
                </label>
                <input
                  type="text"
                  placeholder="Enter prize"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Position Controls Section */}
          {template && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '2px solid #d4d4d4',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                margin: '0 0 15px 0',
                fontSize: '20px',
                color: '#2c3e50',
                borderBottom: '2px solid #ecf0f1',
                paddingBottom: '8px'
              }}>
                Text Positions
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(coords).map(([field, value]) => (
                  <div key={field}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      color: '#7f8c8d',
                      marginBottom: '4px',
                      textTransform: 'capitalize'
                    }}>
                      {field.replace(/([A-Z])/g, ' $1').trim()}:
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateCoord(field, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #bdc3c7',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Section */}
          {template && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '2px solid #d4d4d4',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                margin: '0 0 15px 0',
                fontSize: '20px',
                color: '#2c3e50',
                borderBottom: '2px solid #ecf0f1',
                paddingBottom: '8px'
              }}>
                Download Certificate
              </h2>

              <button
                onClick={downloadCertificate}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
              >
                Download as PNG Image
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #d4d4d4',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              color: '#2c3e50',
              borderBottom: '2px solid #ecf0f1',
              paddingBottom: '8px'
            }}>
              Certificate Preview
            </h2>
            
            <div style={{
              border: '3px solid #34495e',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#fafafa',
              display: 'inline-block'
            }}>
              <canvas
                ref={canvasRef}
                width={1100}
                height={800}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            {!template && (
              <div style={{
                padding: '40px',
                color: '#7f8c8d',
                fontSize: '16px',
                fontStyle: 'italic'
              }}>
                Please upload a certificate template to see the preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}