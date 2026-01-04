
import React, { useEffect, useRef, useCallback } from 'react';
import { HalftoneSettings } from '../types';

interface CanvasPreviewProps {
  image: HTMLImageElement;
  settings: HalftoneSettings;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onProcessingChange: (status: boolean) => void;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ image, settings, canvasRef, onProcessingChange }) => {
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const getLuminance = (r: number, g: number, b: number) => {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    shape: string,
    color?: string
  ) => {
    if (size <= 0.1) return;
    if (color) ctx.fillStyle = color;

    ctx.beginPath();
    switch (shape) {
      case 'circle':
        ctx.arc(x, y, size, 0, Math.PI * 2);
        break;
      case 'square':
        ctx.rect(x - size, y - size, size * 2, size * 2);
        break;
      case 'diamond':
        ctx.moveTo(x, y - size * 1.4);
        ctx.lineTo(x + size * 1.4, y);
        ctx.lineTo(x, y + size * 1.4);
        ctx.lineTo(x - size * 1.4, y);
        break;
      case 'line':
        ctx.rect(x - settings.spacing / 2, y - size / 2, settings.spacing, size);
        break;
    }
    ctx.fill();
  };

  const processImage = useCallback(() => {
    if (!canvasRef.current || !image) return;

    onProcessingChange(true);
    
    // Set internal processing delay for UI responsiveness
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { alpha: false })!;
      
      // Limit size for preview performance
      const maxDim = 1200;
      let width = image.width;
      let height = image.height;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original image to offscreen to get pixel data
      if (!offscreenCanvasRef.current) offscreenCanvasRef.current = document.createElement('canvas');
      const offCanvas = offscreenCanvasRef.current;
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d')!;
      offCtx.drawImage(image, 0, 0, width, height);
      const imageData = offCtx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      // Background
      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, width, height);

      const angleRad = (settings.angle * Math.PI) / 180;
      const spacing = settings.spacing;
      
      // Determine dot color
      ctx.fillStyle = settings.fgColor;

      // CMYK Channels
      const cmykAngles = [15, 75, 0, 45]; // C, M, Y, K
      const cmykColors = ['#00ffff', '#ff00ff', '#ffff00', '#000000'];

      const renderChannel = (angle: number, color?: string, filter?: (r: number, g: number, b: number) => number) => {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        // Calculate bounds for rotated grid
        const diag = Math.sqrt(width * width + height * height);
        for (let y = -diag; y < diag; y += spacing) {
          for (let x = -diag; x < diag; x += spacing) {
            // Transform grid back to image coordinates
            const imgX = Math.round(x * cos - y * sin + width / 2);
            const imgY = Math.round(x * sin + y * cos + height / 2);

            if (imgX >= 0 && imgX < width && imgY >= 0 && imgY < height) {
              const idx = (imgY * width + imgX) * 4;
              const r = pixels[idx];
              const g = pixels[idx + 1];
              const b = pixels[idx + 2];

              let value = 0;
              if (filter) {
                value = filter(r, g, b);
              } else if (settings.mode === 'color') {
                value = getLuminance(r, g, b);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
              } else {
                value = getLuminance(r, g, b);
                ctx.fillStyle = settings.fgColor;
              }

              // Apply contrast/brightness
              value = (value - 0.5) * settings.contrast + 0.5;
              if (settings.invert) value = 1 - value;
              
              // Map intensity to size
              const dotSize = (1 - value) * settings.dotSize * (spacing / 8);
              drawShape(ctx, imgX, imgY, dotSize, settings.shape);
            }
          }
        }
      };

      if (settings.mode === 'cmyk') {
        ctx.globalCompositeOperation = 'multiply';
        // Cyan
        renderChannel(cmykAngles[0], cmykColors[0], (r, g, b) => 1 - (1 - r/255)); 
        // Magenta
        renderChannel(cmykAngles[1], cmykColors[1], (r, g, b) => 1 - (1 - g/255));
        // Yellow
        renderChannel(cmykAngles[2], cmykColors[2], (r, g, b) => 1 - (1 - b/255));
        // Black (K)
        renderChannel(cmykAngles[3], cmykColors[3], (r, g, b) => getLuminance(r, g, b));
        ctx.globalCompositeOperation = 'source-over';
      } else {
        renderChannel(settings.angle);
      }

      onProcessingChange(false);
    }, 0);
  }, [image, settings, canvasRef, onProcessingChange]);

  useEffect(() => {
    processImage();
  }, [processImage]);

  return (
    <canvas 
      ref={canvasRef} 
      className="block bg-black shadow-inner"
      style={{ imageRendering: 'auto' }}
    />
  );
};

export default CanvasPreview;
