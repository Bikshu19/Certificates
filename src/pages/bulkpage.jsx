import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function BulkCertificateGenerator() {
  const canvasRef = useRef(null);
  const templateImageRef = useRef(null);

  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [zipBlob, setZipBlob] = useState(null);

  const [positions, setPositions] = useState({
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
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        templateImageRef.current = img;
        setTemplateLoaded(true);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.naturalWidth || 1100;
          canvas.height = img.naturalHeight || 800;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const sanitizeFileName = (value) =>
    (value || "certificate").replace(/[\\/:*?"<>|]+/g, "").trim();

  const drawCertificate = (name, event, date, prize) => {
    const img = templateImageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#124170";
    ctx.font = "45px Times New Roman";
    ctx.textAlign = "left";

   ctx.fillText(String(name || "").toUpperCase(), positions.nameX, positions.nameY);
ctx.fillText(String(event || "").toUpperCase(), positions.eventX, positions.eventY);
ctx.fillText(String(date || "").toUpperCase(), positions.dateX, positions.dateY);
ctx.fillText(String(prize || "").toUpperCase(), positions.prizeX, positions.prizeY);

  };

  const drawCertificateBlob = (name, event, date, prize) => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      drawCertificate(name, event, date, prize);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to export PNG"));
        resolve(blob);
      }, "image/png");
    });
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!templateLoaded) return alert("Upload a certificate template first");

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data.filter((r) => r.Name);
        setRows(data);
        if (data.length > 0) {
          const { Name, Event, Date, Prize } = data[0];
          drawCertificate(Name, Event, Date, Prize);
        }
      },
    });
  };

  const generateZip = async () => {
    if (!rows.length) return alert("No rows loaded");

    setIsGenerating(true);
    setProgress({ current: 0, total: rows.length, percent: 0 });

    const zip = new JSZip();
    const folder = zip.folder("certificates");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const name = row.Name || row["Full Name"] || `Person_${i + 1}`;
      const event = row.Event || "";
      const date = row.Date || "";
      const prize = row.Prize || "";

      try {
        const blob = await drawCertificateBlob(name, event, date, prize);
        const fileName = sanitizeFileName(name) || `certificate_${i + 1}`;
        folder.file(`${fileName}.png`, blob);
      } catch (err) {
        console.error("Error generating for row", i, err);
      }

      setProgress({
        current: i + 1,
        total: rows.length,
        percent: Math.round(((i + 1) / rows.length) * 100),
      });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    setZipBlob(zipBlob);
    setIsGenerating(false);
  };

  const handleDownloadZip = () => {
    if (zipBlob) {
      saveAs(zipBlob, `certificates_${Date.now()}.zip`);
    }
  };

  const handlePositionChange = (field, value) => {
    setPositions((prev) => {
      const updated = { ...prev, [field]: Number(value) || 0 };
      if (rows.length > 0) {
        const { Name, Event, Date, Prize } = rows[0];
        drawCertificate(Name, Event, Date, Prize);
      }
      return updated;
    });
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
          Bulk certificate creation tool
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Left Panel */}
        <div style={{ flex: '0 0 400px', minWidth: '300px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #d4d4d4',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              color: '#2c3e50',
              borderBottom: '2px solid #ecf0f1',
              paddingBottom: '8px'
            }}>
              Upload Files
            </h2>

            {/* Template Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#34495e'
              }}>
                Certificate Template:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleTemplateUpload}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #bdc3c7',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Data Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#34495e'
              }}>
                Data File (CSV):
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                disabled={!templateLoaded || isGenerating}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #bdc3c7',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: templateLoaded ? '#ffffff' : '#ecf0f1',
                  cursor: templateLoaded ? 'pointer' : 'not-allowed'
                }}
              />
            </div>

            {templateLoaded && (
              <div style={{
                padding: '10px',
                backgroundColor: '#d5f4e6',
                border: '1px solid #27ae60',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#27ae60',
                marginBottom: '20px'
              }}>
                ✓ Template loaded successfully
              </div>
            )}

            {/* Position Controls */}
            {rows.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '16px',
                  color: '#2c3e50',
                  borderBottom: '1px solid #ecf0f1',
                  paddingBottom: '5px'
                }}>
                  Text Positions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(positions).map(([field, value]) => (
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
                        onChange={(e) => handlePositionChange(field, e.target.value)}
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

            {/* Action Buttons */}
            <div style={{ marginTop: '30px', borderTop: '1px solid #ecf0f1', paddingTop: '20px' }}>
              {rows.length > 0 && !isGenerating && (
                <button
                  onClick={generateZip}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  Generate All Certificates
                </button>
              )}

              {isGenerating && (
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  backgroundColor: '#fef9e7',
                  border: '1px solid #f39c12',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}>
                  <div style={{ color: '#f39c12', fontWeight: 'bold', marginBottom: '8px' }}>
                    Generating Certificates...
                  </div>
                  <div style={{
                    backgroundColor: '#ecf0f1',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#f39c12',
                      height: '100%',
                      width: `${progress.percent}%`,
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
                    {progress.current} of {progress.total} ({progress.percent}%)
                  </div>
                </div>
              )}

              {zipBlob && !isGenerating && (
                <button
                  onClick={handleDownloadZip}
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
                  Download ZIP File
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
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
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            {!templateLoaded && (
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
