import Header from "../layout/Header";
import Footer from "../layout/Footer";
import HeroSection from "../home/HeroSection";
import CocktailGrid from "../home/CocktailGrid";
import StatusSection from "../home/StatusSection";

const cocktails = [
    {
        id: 1,
        name: "Violet Spritz",
        category: "Signature",
        origin: "France",
        image:
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80",
        story:
            "Un cocktail pétillant et élégant, pensé pour une ambiance moderne et raffinée.",
        ingredients: ["Liqueur florale", "Citron", "Eau pétillante", "Glaçons"],
        price: "8,50 €",
    },
    {
        id: 2,
        name: "Dark Berry",
        category: "Fruité",
        origin: "Belgique",
        image:
            "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
        story:
            "Une création plus intense, avec une identité visuelle sombre et un profil fruité.",
        ingredients: ["Fruits rouges", "Sirop maison", "Citron vert", "Menthe"],
        price: "9,00 €",
    },
    {
        id: 3,
        name: "White Bloom",
        category: "Sans alcool",
        origin: "Italie",
        image:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
        story:
            "Une boisson douce, claire et légère, idéale pour une carte accessible à tous.",
        ingredients: ["Jus de pomme", "Fleur de sureau", "Citron", "Eau gazeuse"],
        price: "7,50 €",
    },
];

const categories = ["Signatures", "Sans alcool", "Fruités", "Classiques"];

const orderSteps = [
    { label: "Commande reçue", active: false },
    { label: "En préparation", active: true },
    { label: "Servie", active: false },
];

function HomePage() {
    const selectedCocktail = cocktails[0];

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
                <CocktailGrid cocktails={cocktails} />
                <StatusSection selectedCocktail={selectedCocktail} orderSteps={orderSteps} />
            </main>

            <Footer />
        </div>
    );
}

export default HomePage;