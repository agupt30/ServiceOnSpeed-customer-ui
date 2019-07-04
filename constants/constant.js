export const dataList = [
    { id: 1, name: 'Breakdown Service 24 x 7', path: require('../assets/servicesImages/tyres.png'),subservives:["Towing | On-Spot Fixes & Repair | Lockedout | Flat Tyre"],offer:"Anytime,Anywhere within 2hrs"
  },
    { id: 2, name: 'General Service', path: require('../assets/servicesImages/general-services.jpg'),subservives:["Oil CheckUp | Filter Check | Greasing & Lubricating | Exterior Washing"],offer:"Get 15% off on first 3 servicing"
  },
    { id: 3, name: 'Cleaning Service', path: require('../assets/servicesImages/images.jpg'),subservives:["Eco Wash | Waxing | Intensive Cleaning | Nano Coating"],offer:"Top Rated Cleaning Services"
  },
    { id: 4, name: 'Wheel Alignment and Balancing', path: require('../assets/servicesImages/tyres.png'),subservives:["Wheel Bearing Replacement | Stud & Nut Replacement"],offer:"Available at MRP"},
    { id: 5, name: 'Dents and Paints', path: require('../assets/servicesImages/dent-paint.jpg'),subservives:["Bonnet Dent Removal | Paint Scratches | "],offer:"Assured Services"
	},
	
	];
	// export const cars = [
	// 	{
	// 		"name": "Maruti Alto KTF Petrol",
	// 		"Type": "F",
	// 		"BrandId": 24,
	// 		"id": 1
	// 	}
	// ]
	
	export const getPushNotificationData = (statusValue,bookingData) => {
		let token = bookingData.token, title, body, data = {"bookingStatusFlag": true}
		if(statusValue === 0) {
			title = 'Booking Confirmed',
			body =  bookingData.customerName + ', Has requested for a booking of ' + bookingData.vehicle + 'Kindly click to confirm.'
			data = {
				"bookingStatusValue": statusValue
			}
		}
	
		if(statusValue === 3) {
			title = 'Vehicle Picked Up',
			body = 'Please start inspecting and create job card'
			data = {
				...data,
				"bookingStatusValue": statusValue
			}
		}
	
		if(statusValue === 6) {
			title = 'Payment Initiated',
			body = 'Customer initiated the Payment'
			data = {
				...data,
				"bookingStatusValue": statusValue,
			}
		}

		if(statusValue === 7) {
			title = 'Booking Completed',
			body = 'Customer has Completed the Payment'
			data = {
				...data,
				"bookingStatusValue": statusValue,
			}
		}
		return {token,title,body,data}
	}

	// Date format Conversion
	export const dateFormat = (date) => {
		//alert(date.substr(0,10));

		// let day = date.getDay();
		// let month = date.getMonth();
		// let year = date.getFullYear();
		// fullDate = year+"-"+(month+1)+"-"+day;
		return date.substr(0,10);
	}
