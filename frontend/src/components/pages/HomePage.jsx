import { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import HeroSection from '../home/HeroSection';
import CocktailGrid from '../home/CocktailGrid';
import StatusSection from '../home/StatusSection';
import api from '../../lib/api';

function HomePage() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  useEffect(() => {
    api.get('/api/cocktails')
      .then((res) => {
        setCocktails(res.data);
        if (res.data.length > 0) setSelectedCocktail(res.data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-zinc-950 focus:px-4 focus:py-3 focus:text-white"
      >
        Aller au contenu
      </a>

      <Header />

      <main id="main-content">
        <HeroSection selectedCocktail={selectedCocktail} />
        <CocktailGrid
          cocktails={cocktails}
          loading={loading}
          onSelect={(cocktail) => {
            setSelectedCocktail(cocktail);
            document.getElementById('commande')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <StatusSection
          selectedCocktail={selectedCocktail}
          onOrderPlaced={() => {
            api.get('/api/cocktails')
              .then((res) => setCocktails(res.data))
              .catch(console.error);
          }}
        />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
