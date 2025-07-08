// Main TypeScript file for Endless Job Page
import '../src/main.ts'

// Mobile Menu Controller
class MobileMenuController {
	private menuToggle: HTMLElement | null
	private overlay: HTMLElement | null
	private menu: HTMLElement | null
	private burgerIcon: HTMLElement | null
	private closeIcon: HTMLElement | null
	private mobileNavItems: NodeListOf<Element>
	private isMenuOpen = false

	constructor() {
		this.menuToggle = document.getElementById('mobile-menu-toggle')
		this.overlay = document.getElementById('mobile-nav-overlay')
		this.menu = document.getElementById('mobile-nav-menu')
		this.burgerIcon = document.getElementById('burger-icon')
		this.closeIcon = document.getElementById('close-icon')
		this.mobileNavItems = document.querySelectorAll('.mobile-tab[data-section]')

		this.init()
	}

	private init(): void {
		this.setupMenuToggle()
		this.setupMobileNavigation()
		this.setupOverlayClose()
	}

	private setupMenuToggle(): void {
		if (this.menuToggle) {
			this.menuToggle.addEventListener('click', () => {
				this.toggleMenu()
			})
		}
	}

	private setupMobileNavigation(): void {
		this.mobileNavItems.forEach(item => {
			item.addEventListener('click', e => {
				e.preventDefault()
				const targetSection = item.getAttribute('data-section')
				if (targetSection) {
					this.scrollToSection(targetSection)
					this.setActiveMobileNav(item)
					this.closeMenu()
				}
			})
		})
	}

	private setupOverlayClose(): void {
		if (this.overlay) {
			this.overlay.addEventListener('click', (e) => {
				if (e.target === this.overlay) {
					this.closeMenu()
				}
			})
		}
	}

	private toggleMenu(): void {
		if (this.isMenuOpen) {
			this.closeMenu()
		} else {
			this.openMenu()
		}
	}

	private openMenu(): void {
		this.isMenuOpen = true
		this.overlay?.classList.add('mobile-nav-overlay-open')
		this.menu?.classList.add('mobile-nav-open')
		this.menuToggle?.classList.add('menu-open')
		this.burgerIcon?.classList.add('hidden')
		this.closeIcon?.classList.remove('hidden')
		document.body.style.overflow = 'hidden'
	}

	private closeMenu(): void {
		this.isMenuOpen = false
		this.overlay?.classList.remove('mobile-nav-overlay-open')
		this.menu?.classList.remove('mobile-nav-open')
		this.menuToggle?.classList.remove('menu-open')
		this.burgerIcon?.classList.remove('hidden')
		this.closeIcon?.classList.add('hidden')
		document.body.style.overflow = ''
	}

	private scrollToSection(sectionId: string): void {
		const targetElement = document.getElementById(sectionId)
		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	private setActiveMobileNav(activeItem: Element): void {
		// Remove active class from all mobile nav items
		this.mobileNavItems.forEach(item => {
			item.classList.remove('active')
		})

		// Add active class to clicked item
		activeItem.classList.add('active')
	}
}

// Navigation functionality
class NavigationController {
	private navItems: NodeListOf<Element>
	private sections: NodeListOf<Element>
	private contentArea: Element | null

	constructor() {
		this.navItems = document.querySelectorAll('[data-section]')
		this.sections = document.querySelectorAll('.section')
		this.contentArea = document.querySelector(
			'section.flex-1.p-8.overflow-y-auto, section.main-block'
		)

		this.init()
	}

	private init(): void {
		this.setupNavigation()
		this.setupScrollspy()
		// Set initial active state
		this.setInitialActiveState()
	}

	private setInitialActiveState(): void {
		const firstDesktopTab = document.querySelector('.tab[data-section="general"]')
		if (firstDesktopTab) {
			this.setActiveDesktopNav(firstDesktopTab)
		}
	}

	private setupNavigation(): void {
		this.navItems.forEach(item => {
			item.addEventListener('click', e => {
				e.preventDefault()
				const targetSection = item.getAttribute('data-section')
				if (targetSection) {
					this.scrollToSection(targetSection)
					this.setActiveNav(item)
				}
			})
		})
	}

	private scrollToSection(sectionId: string): void {
		const targetElement = document.getElementById(sectionId)
		if (targetElement && this.contentArea) {
			// Smooth scroll to the target section
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	private setActiveNav(activeItem: Element): void {
		// Handle desktop navigation
		if (activeItem.classList.contains('tab')) {
			this.setActiveDesktopNav(activeItem)
		}

		// Handle mobile navigation
		if (activeItem.classList.contains('mobile-tab')) {
			this.setActiveMobileNav(activeItem)
		}
	}

	private setActiveDesktopNav(activeItem: Element): void {
		// Remove active class from all desktop nav items
		const desktopNavItems = document.querySelectorAll('.tab[data-section]')
		desktopNavItems.forEach(item => {
			item.classList.remove('active')
		})

		// Add active class to clicked item
		activeItem.classList.add('active')
	}

	private setActiveMobileNav(activeItem: Element): void {
		// Remove active class from all mobile nav items
		const mobileNavItems = document.querySelectorAll('.mobile-tab[data-section]')
		mobileNavItems.forEach(item => {
			item.classList.remove('active')
		})

		// Add active class to clicked item
		activeItem.classList.add('active')
	}

	private setupScrollspy(): void {
		if (!this.contentArea) return

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const sectionId = entry.target.id
						const correspondingDesktopNavItem = document.querySelector(
							`.tab[data-section="${sectionId}"]`
						)
						const correspondingMobileNavItem = document.querySelector(
							`.mobile-tab[data-section="${sectionId}"]`
						)

						if (correspondingDesktopNavItem) {
							this.setActiveDesktopNav(correspondingDesktopNavItem)
						}

						if (correspondingMobileNavItem) {
							this.setActiveMobileNav(correspondingMobileNavItem)
						}
					}
				})
			},
			{
				threshold: 0.3,
				rootMargin: '-20% 0% -20% 0%',
			}
		)

		// Observe all sections
		this.sections.forEach(section => {
			observer.observe(section)
		})
	}
}

// Smooth animations for buttons and interactions
class AnimationController {
	constructor() {
		this.init()
	}

	private init(): void {
		this.setupButtonAnimations()
		this.setupHoverEffects()
	}

	private setupButtonAnimations(): void {
		const buttons = document.querySelectorAll('button')

		buttons.forEach(button => {
			button.addEventListener('mouseenter', () => {
				if (!button.id || button.id !== 'mobile-menu-toggle') {
					button.style.transform = 'translateY(-1px)'
					button.style.transition = 'transform 0.2s ease'
				}
			})

			button.addEventListener('mouseleave', () => {
				if (!button.id || button.id !== 'mobile-menu-toggle') {
					button.style.transform = 'translateY(0)'
				}
			})

			button.addEventListener('mousedown', () => {
				if (!button.id || button.id !== 'mobile-menu-toggle') {
					button.style.transform = 'translateY(0)'
				}
			})
		})
	}

	private setupHoverEffects(): void {
		// Add subtle hover effects to cards
		const cards = document.querySelectorAll('.bg-white.rounded-lg')

		cards.forEach(card => {
			card.addEventListener('mouseenter', () => {
				;(card as HTMLElement).style.boxShadow =
					'0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
				;(card as HTMLElement).style.transition = 'box-shadow 0.3s ease'
			})

			card.addEventListener('mouseleave', () => {
				;(card as HTMLElement).style.boxShadow =
					'0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
			})
		})
	}
}

// Hiring funnel animation
class HiringFunnelController {
	private funnelSteps: NodeListOf<Element>

	constructor() {
		this.funnelSteps = document.querySelectorAll(
			'#hiring-funnel .flex.flex-col.items-center'
		)
		this.init()
	}

	private init(): void {
		// Animate funnel steps when they come into view
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						this.animateFunnelSteps()
					}
				})
			},
			{ threshold: 0.5 }
		)

		const funnelSection = document.getElementById('hiring-funnel')
		if (funnelSection) {
			observer.observe(funnelSection)
		}
	}

	private animateFunnelSteps(): void {
		this.funnelSteps.forEach((step, index) => {
			setTimeout(() => {
				step.classList.add('animate-fade-in-up')
			}, index * 200)
		})
	}
}

// Team member interactions
class TeamController {
	constructor() {
		this.init()
	}

	private init(): void {
		const teamMembers = document.querySelectorAll('.flex.items-center.gap-3')

		teamMembers.forEach(member => {
			member.addEventListener('mouseenter', () => {
				const avatar = member.querySelector('.rounded-full')
				if (avatar) {
					;(avatar as HTMLElement).style.transition = 'transform 0.2s ease'
				}
			})

			member.addEventListener('mouseleave', () => {
				const avatar = member.querySelector('.rounded-full')
				if (avatar) {
					;(avatar as HTMLElement).style.transform = 'scale(1)'
				}
			})
		})
	}
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new MobileMenuController()
	new NavigationController()
	new AnimationController()
	new HiringFunnelController()
	new TeamController()

	// Add some additional CSS animations
	const style = document.createElement('style')
	style.textContent = `
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section {
      scroll-margin-top: 20px;
    }

    /* Smooth scrolling for the content area */
    .overflow-y-auto {
      scroll-behavior: smooth;
    }

    /* Custom scrollbar for content area */
    .overflow-y-auto::-webkit-scrollbar {
      width: 6px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `
	document.head.appendChild(style)
})

// Add some console logging for debugging
console.log('Endless Job Page with enhanced mobile navigation initialized successfully!')
