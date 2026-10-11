

const NavLinks = async () => {
    const res= await fetch("https://openapi.programming-hero.com/api/bazardor/categories")
    const data = await res.json()
    
    return (
        <div>
            
        </div>
    );
};

export default NavLinks;