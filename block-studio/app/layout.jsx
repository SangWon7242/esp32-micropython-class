import './globals.css';
import Providers from './providers';
import Header from '../components/Header';
export const metadata={title:'ESP32 Block Studio | 단계별 블록코딩',description:'ESP32 블록코딩 → MicroPython 양방향 실습, Keyestudio KS5020 기반 학습 로드맵'};
export default function RootLayout({children}){return <html lang="ko"><body><Providers><Header/>{children}</Providers></body></html>}
