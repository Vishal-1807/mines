import { Assets } from 'pixi.js';
import { GlobalState } from "./globals/gameState";
import { REACT_MODE } from "./components/constants/ReactMode";

export async function loadAssets() {
    // const ASSET_BASE = '';
    const ASSET_BASE = REACT_MODE ? GlobalState.getS3Url()+'mines/' : 'https://s3.eu-west-2.amazonaws.com/static.inferixai.link/pixi-game-assets/mines/'
    
    // Load all assets including the font file
    await Assets.load([
        { alias: 'gridCell', src: `${ASSET_BASE}assets/Grid_Cell.png` },
        { alias: 'diamondSprite', src: `${ASSET_BASE}sprites/diamond.json` },
        { alias: 'bomb', src: `${ASSET_BASE}assets/boom.png` },
        { alias: 'bombSprite', src: `${ASSET_BASE}sprites/bomb.json` },
    ]);

    console.log('All assets loaded successfully');

    // Register the custom font for use in PIXI Text
    try {
        // Use the direct path to the font file
        const fontUrl = `${ASSET_BASE}assets/gameFont.ttf`;
        const fontFace = new FontFace('GameFont', `url(${fontUrl})`);
        
        await fontFace.load();
        document.fonts.add(fontFace);
        
        console.log('✅ Custom font "GameFont" loaded and registered successfully');
        
        // Verify the font is available
        await document.fonts.ready;
        const isAvailable = document.fonts.check('16px GameFont');
        console.log('Font availability check:', isAvailable);
        
    } catch (fontError) {
        console.warn('⚠️ Failed to load custom font "GameFont":', fontError);
        console.log('Will fallback to system fonts');
    }
}

export function hideSplash() {
    const splash = document.getElementById('splash');
    if (splash) splash.remove();
}

export function setupSplashVideoLoadDetection() {
    console.log('🎬 Setting up splash video load detection');
    
    // Find the splash video element (created in main.ts)
    const splash = document.getElementById('splash');
    if (!splash) {
      console.warn('⚠️ Splash element not found');
      return;
    }
    
    const video = splash.querySelector('video');
    if (!video) {
      console.warn('⚠️ Video element not found in splash');
      return;
    }
    
    // Add loading detection
    video.addEventListener('loadeddata', () => { //loadeddata is native HTML5 listener for video element
      console.log('🎬 Splash video loaded successfully');
      // Notify React that splash is ready
      if (typeof (window as any).loadingCompleted === 'function') {
        (window as any).loadingCompleted();
      }
    });
  
    video.addEventListener('error', (e) => {
      console.error('❌ Error loading splash video:', e);
      // Still notify React to avoid infinite loading
      if (typeof (window as any).loadingCompleted === 'function') {
        (window as any).loadingCompleted();
      }
    });
  }