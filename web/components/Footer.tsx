import Container from "./Container"

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <Container>
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} CineFriends. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="/about" className="hover:text-primary transition-colors">
                About
              </a>
              <a
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
