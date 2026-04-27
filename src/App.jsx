import './index.css';
import FadeInObserver from './components/FadeInObserver';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Recipe from './components/Recipe';
import Credentials from './components/Credentials';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <FadeInObserver />
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <Recipe />
      <Credentials />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}
