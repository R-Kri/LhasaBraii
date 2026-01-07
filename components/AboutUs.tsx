export default function AboutPage() {
    return (
        <main className="bg-background text-foreground">
            <section className="container mx-auto px-4 py-20 max-w-4xl">
                {/* Header */}
                <header className="space-y-4 mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        About Lhasa
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        A second-hand book marketplace inspired by continuity, reuse, and
                        the quiet power of knowledge.
                    </p>
                </header>

                {/* Origin */}
                <section className="space-y-4 mb-12">
                    <h2 className="text-xl font-medium">Our Name & Origin</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Lhasa takes its name from a river in the Lohit district — a symbol of
                        flow, renewal, and continuity. Much like a river carries water
                        forward, Lhasa exists to carry knowledge from one reader to the
                        next, ensuring books continue to serve a purpose long after their
                        first use.
                    </p>
                </section>

                {/* What We Do */}
                <section className="space-y-4 mb-12">
                    <h2 className="text-xl font-medium">What We Do</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Lhasa is a platform where readers can buy and sell second-hand books
                        with confidence. We focus on accessibility, affordability, and
                        sustainability — making quality books easier to find while giving
                        used books a longer life.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Whether you are a student clearing old textbooks, a reader searching
                        for affordable titles, or someone who believes books deserve more
                        than a shelf or landfill, Lhasa is built for you.
                    </p>
                </section>

                {/* Why It Matters */}
                <section className="space-y-4 mb-12">
                    <h2 className="text-xl font-medium">Why It Matters</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Millions of books are discarded every year despite being perfectly
                        usable. At the same time, many readers struggle with the cost of new
                        books. Lhasa bridges this gap by enabling a circular exchange —
                        reducing waste while expanding access to knowledge.
                    </p>
                </section>

                {/* Principles */}
                <section className="space-y-6 mb-12">
                    <h2 className="text-xl font-medium">Our Principles</h2>
                    <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                        <li>Clarity over complexity</li>
                        <li>Sustainability through reuse</li>
                        <li>Trust between buyers and sellers</li>
                        <li>Technology that serves people, not the other way around</li>
                    </ul>
                </section>

                {/* Closing */}
                <section className="space-y-4">
                    <h2 className="text-xl font-medium">Looking Ahead</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Lhasa is continuously evolving. Our goal is to build a reliable,
                        transparent, and thoughtfully engineered platform that respects both
                        books and the people who use them.
                    </p>
                </section>
            </section>
        </main>
    );
}
