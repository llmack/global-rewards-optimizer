# Travel Rewards Points Optimizer

A comprehensive web application for optimizing travel rewards points and credit card benefits for trips to India.

## Features

### Credit Card Management
- **Search & Discovery**: Find credit cards with signup bonuses and airline partnerships
- **Portfolio Management**: Add cards to your personal portfolio with duplicate prevention
- **Points Tracking**: Manually enter and update your current points balance
- **Secure Storage**: Anonymous and secure local storage of your data
- **Save Favorites**: Heart/save credit cards for later reference

### Flight Search & Analysis
- **Smart Search**: Search flights by city name or 3-letter airport codes
- **Philadelphia Focus**: Specialized search for flights from PHL, EWR, JFK, LGA
- **Value Analysis**: Calculate cents-per-point value for different redemption options
- **Award Availability**: Real-time availability status (good/limited/waitlist)
- **Date Flexibility**: Search dates from today up to one year in the future

### Points Calculator
- **Goal Setting**: Set target points needed for your dream trip
- **Portfolio Analysis**: Calculate total available points across all cards
- **Bonus Tracking**: Factor in signup bonuses and spending requirements
- **Shortfall Analysis**: Identify how many more points you need

### Transfer Partners
- **Partnership Details**: Comprehensive transfer partner information
- **Bonus Promotions**: Track limited-time transfer bonuses
- **Value Optimization**: Find the best transfer ratios and timing

### Destination Guide
- **India Focus**: Specialized information for January travel to India
- **Weather Insights**: Current weather conditions and travel tips
- **Cultural Highlights**: Must-see attractions and experiences

## Technical Features

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Keyboard Navigation**: ESC key support for closing modals
- **Engagement Tracking**: Anonymous analytics for user interactions
- **Secure Data**: Encrypted local storage for privacy

### Data Management
- **Duplicate Prevention**: Smart logic prevents duplicate card entries
- **Persistent Storage**: Your data is saved and restored between sessions
- **Privacy First**: All data stored locally, no external tracking

## Usage

1. **Search Credit Cards**: Use the search bar to find cards by name, bank, or airline partner
2. **Add to Portfolio**: Click "Add to Portfolio" to add cards to your collection
3. **Update Points**: Click the edit icon to update your current points balance
4. **Search Flights**: Enter departure/arrival cities and travel dates
5. **Save Favorites**: Use the heart icon to save cards and flights for later
6. **Calculate Goals**: Set your target points and see optimization strategies

## Privacy & Security

- All data is stored locally in your browser
- No personal information is transmitted to external servers
- Anonymous usage analytics help improve the application
- Data is encrypted using basic obfuscation techniques

## Development

Built with:
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

## Deployment

The application is deployed on Netlify and can be accessed at the provided URL.

## Known Issues & Fixes

### Fixed Issues:
- ✅ Duplicate credit card entries in portfolio
- ✅ No way to remove credit cards from portfolio
- ✅ Modal pop-ups couldn't be closed without adding to portfolio
- ✅ Airport search now supports city names and 3-letter codes
- ✅ Date selector properly supports current date to one year future
- ✅ Philadelphia area flight focus (PHL, EWR, JFK, LGA)

### Recent Updates:
- Added remove button (trash icon) for each credit card in portfolio
- Implemented ESC key support for closing modals
- Added close button and improved modal UX
- Enhanced duplicate prevention logic
- Focused flight search on Philadelphia metropolitan area
- Improved airport search with better city/code matching

## Contributing

This is a prototype application designed for travel rewards optimization. Future enhancements could include:
- Real-time flight data integration
- Credit card API connections
- Advanced analytics and recommendations
- Social features for sharing strategies