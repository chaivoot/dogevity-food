import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import FadeInObserver from './components/FadeInObserver';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Recipe from './components/Recipe';
import CalorieCalculator from './components/CalorieCalculator';
import Credentials from './components/Credentials';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import LoginPage from './webapp/LoginPage';
import WebApp from './webapp/WebApp';

function LandingPage() {
  return (
    <>
      <FadeInObserver />
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <Recipe />
      <CalorieCalculator />
      <Credentials />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<WebApp />} />
      </Routes>
    </BrowserRouter>
  );
}
