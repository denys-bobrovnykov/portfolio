const apiKey = 'jj3S44xqIDCbszc1QoW-eZ2fFlnwtl2eH6vWTnYWe-vHmxqNjzsJr3_u5F2g2sCF1ST8wKMgJppklcpyAbqdJ7e4AEoTopfr_uw8UJsTztv7g8Oqlx6xNauQQOVtX3Yx';

const Yelp = {

    search(term, location, sortBy){
        return fetch(`https://cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,
                    {headers: {
                        Authorization: 'Bearer' + ' '+ apiKey,
                    }})
                    .then(res => res.json())
                    .then(jsonResponse => {
                        if(jsonResponse.businesses){
                            console.log(jsonResponse);
                            return jsonResponse.businesses.map(business => {
                                return {
                                    'id': business.id,
                                    'imageSrc': business.image_url,
                                    'name': business.name,
                                    'address': business.location.address1,
                                    'city': business.location.city,
                                    'state': business.location.state,
                                    'zipCode': business.location.zip_code,
                                    'category': business.categories.title,
                                    'rating': business.rating,
                                    'reviewCount': business.review_count,
                                    'coordinates': business.coordinates,
                                }
                            });
                        }
                        throw new Error('Load failed!');
                    
                    }).catch(error => console.log(error));
    }

}

export default Yelp;