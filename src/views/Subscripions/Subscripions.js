import React from 'react'
import { Link } from 'react-router-dom';

const d = new Date();
const currentDate = d.toDateString();
const data = [
    {
        "id": "1",
        "name": "3 Month Pass",
        "duration/days": 90,
        "expiryDate": currentDate,
        "routes": "all",
        "price": 30.000,
        "company": "KPTC",
      },
      {
        "id": "2",
        "name": "Monthly Pass",
        "duration/days": 30,
        "expiryDate": currentDate,
        "routes": "all",
        "price": 12.500,
        "company": "KPTC",
      },
      {
        "id": "3",
        "name": "Weekly Pass",
        "duration/days": 7,
        "expiryDate": currentDate,
        "routes": "all",
        "price": 5.000,
        "company": "KPTC",
      },
      {
        "id": "4",
        "name": "Daily Pass",
        "duration/days": 1,
        "expiryDate": currentDate,
        "routes": "all",
        "price": 0.75,
        "company": "KPTC",
        "isActive":false
      },
]

function Subscripions() {

    console.log(data)


  return (
    <div>
        <h2>Subscripions</h2>
        {data.map((item) => {
            return (
                <Link to='/Subscripions/SubscripionsDetails' className='package'>

                <div>Name: <strong>{item.name}</strong></div>
                <div>Company name: <strong>{item.company}</strong></div>
                <div>Duration days: <strong>{item['duration/days']}</strong></div>
                <div>Expiry date: <strong>{item.expiryDate}</strong></div>
                <div>Status: <strong>{item.isActive}</strong></div>
                <div>Price: <strong>{item.price}</strong></div>
                <div>Routes <strong>{item.routes}</strong></div>
      
                </Link>
            )
        })}
    </div>
  )
}

export default Subscripions



