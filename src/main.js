// Main JavaScript file for Endless Job Page
import './style.css'

// Mobile Menu Controller
class MobileMenuController {
	constructor() {
		this.menuToggle = document.getElementById('mobile-menu-toggle')
		this.overlay = document.getElementById('mobile-nav-overlay')
		this.menu = document.getElementById('mobile-nav-menu')
		this.burgerIcon = document.getElementById('burger-icon')
		this.closeIcon = document.getElementById('close-icon')
		this.mobileNavItems = document.querySelectorAll('.mobile-tab[data-section]')
		this.isMenuOpen = false

		this.init()
	}

	init() {
		this.setupMenuToggle()
		this.setupMobileNavigation()
		this.setupOverlayClose()
	}

	setupMenuToggle() {
		if (this.menuToggle) {
			this.menuToggle.addEventListener('click', () => {
				this.toggleMenu()
			})
		}
	}

	setupMobileNavigation() {
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

	setupOverlayClose() {
		if (this.overlay) {
			this.overlay.addEventListener('click', e => {
				if (e.target === this.overlay) {
					this.closeMenu()
				}
			})
		}
	}

	toggleMenu() {
		if (this.isMenuOpen) {
			this.closeMenu()
		} else {
			this.openMenu()
		}
	}

	openMenu() {
		this.isMenuOpen = true
		this.overlay?.classList.add('mobile-nav-overlay-open')
		this.menu?.classList.add('mobile-nav-open')
		this.menuToggle?.classList.add('menu-open')
		this.burgerIcon?.classList.add('hidden')
		this.closeIcon?.classList.remove('hidden')
		document.body.style.overflow = 'hidden'
	}

	closeMenu() {
		this.isMenuOpen = false
		this.overlay?.classList.remove('mobile-nav-overlay-open')
		this.menu?.classList.remove('mobile-nav-open')
		this.menuToggle?.classList.remove('menu-open')
		this.burgerIcon?.classList.remove('hidden')
		this.closeIcon?.classList.add('hidden')
		document.body.style.overflow = ''
	}

	scrollToSection(sectionId) {
		const targetElement = document.getElementById(sectionId)
		if (targetElement) {
			// Calculate offset for better positioning
			const offsetTop = targetElement.offsetTop - 80 // 80px offset for header

			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth',
			})
		}
	}

	setActiveMobileNav(activeItem) {
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
	constructor() {
		this.navItems = document.querySelectorAll('[data-section]')
		this.sections = document.querySelectorAll('.section')
		this.contentArea = document.querySelector(
			'section.flex-1.p-8.overflow-y-auto, section.main-block'
		)

		this.init()
	}

	init() {
		this.setupNavigation()
		// Disable scrollspy to prevent automatic tab switching during scroll
		// this.setupScrollspy()
		// Set initial active state
		this.setInitialActiveState()
	}

	setInitialActiveState() {
		const firstDesktopTab = document.querySelector(
			'.tab[data-section="general"]'
		)
		if (firstDesktopTab) {
			this.setActiveDesktopNav(firstDesktopTab)
		}
	}

	setupNavigation() {
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

	scrollToSection(sectionId) {
		const targetElement = document.getElementById(sectionId)
		if (targetElement) {
			// Calculate offset for better positioning
			const offsetTop = targetElement.offsetTop - 80 // 80px offset for header

			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth',
			})
		}
	}

	setActiveNav(activeItem) {
		const targetSection = activeItem.getAttribute('data-section')

		// Update both desktop and mobile navigation to keep them in sync
		if (activeItem.classList.contains('tab')) {
			this.setActiveDesktopNav(activeItem)
			// Also update corresponding mobile nav
			const correspondingMobileNavItem = document.querySelector(
				`.mobile-tab[data-section="${targetSection}"]`
			)
			if (correspondingMobileNavItem) {
				this.setActiveMobileNav(correspondingMobileNavItem)
			}
		}

		if (activeItem.classList.contains('mobile-tab')) {
			this.setActiveMobileNav(activeItem)
			// Also update corresponding desktop nav
			const correspondingDesktopNavItem = document.querySelector(
				`.tab[data-section="${targetSection}"]`
			)
			if (correspondingDesktopNavItem) {
				this.setActiveDesktopNav(correspondingDesktopNavItem)
			}
		}
	}

	setActiveDesktopNav(activeItem) {
		// Remove active class from all desktop nav items
		const desktopNavItems = document.querySelectorAll('.tab[data-section]')
		desktopNavItems.forEach(item => {
			item.classList.remove('active')
		})

		// Add active class to clicked item
		activeItem.classList.add('active')
	}

	setActiveMobileNav(activeItem) {
		// Remove active class from all mobile nav items
		const mobileNavItems = document.querySelectorAll(
			'.mobile-tab[data-section]'
		)
		mobileNavItems.forEach(item => {
			item.classList.remove('active')
		})

		// Add active class to clicked item
		activeItem.classList.add('active')
	}

	setupScrollspy() {
		if (!this.contentArea) return

		let activeSection = null
		let debounceTimer = null

		const observer = new IntersectionObserver(
			entries => {
				// Clear previous debounce timer
				if (debounceTimer) {
					clearTimeout(debounceTimer)
				}

				// Debounce to prevent rapid switching
				debounceTimer = setTimeout(() => {
					// Find the section with the highest intersection ratio
					let mostVisibleSection = null
					let highestRatio = 0

					entries.forEach(entry => {
						if (
							entry.isIntersecting &&
							entry.intersectionRatio > highestRatio
						) {
							highestRatio = entry.intersectionRatio
							mostVisibleSection = entry.target
						}
					})

					// If no section is intersecting, find the closest one
					if (!mostVisibleSection) {
						let closestDistance = Infinity
						entries.forEach(entry => {
							const rect = entry.target.getBoundingClientRect()
							const distance = Math.abs(rect.top)
							if (distance < closestDistance) {
								closestDistance = distance
								mostVisibleSection = entry.target
							}
						})
					}

					// Update active section only if it's different
					if (mostVisibleSection && mostVisibleSection !== activeSection) {
						activeSection = mostVisibleSection
						const sectionId = activeSection.id

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
				}, 100) // 100ms debounce
			},
			{
				threshold: [0, 0.25, 0.5, 0.75, 1],
				rootMargin: '-10% 0% -10% 0%',
			}
		)

		// Observe all sections
		this.sections.forEach(section => {
			observer.observe(section)
		})

		// Also handle manual scroll to update active section
		let scrollTimer = null
		window.addEventListener('scroll', () => {
			if (scrollTimer) {
				clearTimeout(scrollTimer)
			}

			scrollTimer = setTimeout(() => {
				// Find the section closest to the top of the viewport
				let closestSection = null
				let closestDistance = Infinity

				this.sections.forEach(section => {
					const rect = section.getBoundingClientRect()
					const distance = Math.abs(rect.top - 100) // 100px offset for better UX

					if (distance < closestDistance) {
						closestDistance = distance
						closestSection = section
					}
				})

				if (closestSection && closestSection !== activeSection) {
					activeSection = closestSection
					const sectionId = activeSection.id

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
			}, 150)
		})
	}
}

// Smooth animations for buttons and interactions
class AnimationController {
	constructor() {
		this.init()
	}

	init() {
		this.setupButtonAnimations()
		this.setupHoverEffects()
	}

	setupButtonAnimations() {
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

	setupHoverEffects() {
		// Add subtle hover effects to cards
		const cards = document.querySelectorAll('.bg-white.rounded-lg')

		cards.forEach(card => {
			card.addEventListener('mouseenter', () => {
				card.style.boxShadow =
					'0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
				card.style.transition = 'box-shadow 0.3s ease'
			})

			card.addEventListener('mouseleave', () => {
				card.style.boxShadow =
					'0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
			})
		})
	}
}

// Hiring funnel animation
class HiringFunnelController {
	constructor() {
		this.funnelSteps = document.querySelectorAll(
			'#hiring-funnel .flex.flex-col.items-center'
		)
		this.init()
	}

	init() {
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

	animateFunnelSteps() {
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

	init() {
		const teamMembers = document.querySelectorAll('.flex.items-center.gap-3')

		teamMembers.forEach(member => {
			member.addEventListener('mouseenter', () => {
				const avatar = member.querySelector('.rounded-full')
				if (avatar) {
					avatar.style.transition = 'transform 0.2s ease'
				}
			})

			member.addEventListener('mouseleave', () => {
				const avatar = member.querySelector('.rounded-full')
				if (avatar) {
					avatar.style.transform = 'scale(1)'
				}
			})
		})
	}
}

// Initialize everything when DOM is loaded
function initializeApp() {
	try {
		console.log('Initializing app...')

		new MobileMenuController()
		new NavigationController()
		new AnimationController()
		new HiringFunnelController()
		new TeamController()

		console.log(
			'Endless Job Page with enhanced mobile navigation initialized successfully!'
		)
		window.appInitialized = true
	} catch (error) {
		console.error('Error initializing app:', error)
	}
}

// Multiple ways to ensure the app initializes
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeApp)
} else {
	// DOM is already loaded
	initializeApp()
}

// Fallback initialization
window.addEventListener('load', () => {
	// Double check that everything is initialized
	if (!window.appInitialized) {
		console.log('Fallback initialization...')
		initializeApp()
	}
})
