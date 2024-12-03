# restaurant-js
Node js project restaurant js


Create a database in POSTGRES SQL.

Create tables using the queries present in the page "create_tables.docx"

Create records in the Resturant tables, using belows few queries

************************************************************************************************************
INSERT INTO raddresses 
(restaurant_id, street_addr, city, state, zipcode, country, latitude, longitude)
VALUES 
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', '800 The Embarcadero', 'San Francisco', 'CA', '94107', 'US', 37.78129959, -122.38869477);

INSERT INTO operating_hours (restaurant_id, type, day, hours)
VALUES
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Monday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Monday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Tuesday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Tuesday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Wednesday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Wednesday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Thursday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Thursday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Friday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Friday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Saturday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Saturday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'operational', 'Sunday', '07:00AM - 09:00PM'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'delivery', 'Sunday', '07:00AM - 09:00PM');

INSERT INTO cuisines (restaurant_id, cuisine)
VALUES
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Breakfast'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Dinner'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Italian'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Pizza'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Chinese'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Sizzlers'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Salads'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'Biryani');
-- Add all cuisines

INSERT INTO photos (restaurant_id, type, url)
VALUES
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'food_photo', 'https://cdn-img.mealme.ai/f3d0e396f1b552927092bafa65ef2cc4e8b57c22/68747470733a2f2f6d656469612d63646e2e677275626875622e636f6d2f696d6167652f75706c6f61642f62657462706b3570747a37756a306279616b6a672e6a7067'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', 'logo_photo', 'https://cdn-img.mealme.ai/25b450d4e72eea47dccd744c326e49e23343bd0d/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f677275626875622f696d6167652f75706c6f61642f76313531383830323236382f63686a6a356173716f6766696e726f7671376f732e706e67');
-- Add other photos


INSERT INTO menus (restaurant_id, cuisine_id, name, description)
VALUES
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', (SELECT id FROM cuisines WHERE cuisine = 'Chinese'), 'Chinese Specials', 'A collection of our best Chinese dishes.'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', (SELECT id FROM cuisines WHERE cuisine = 'Sizzlers'), 'Sizzlers Specials', 'A collection of our best Sizzlers dishes.'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', (SELECT id FROM cuisines WHERE cuisine = 'Salads'), 'Salads Specials', 'A collection of our best Salads dishes.'),
('9a81e95e-3394-4ed3-b5ea-f78286d1687c', (SELECT id FROM cuisines WHERE cuisine = 'Biryani'), 'Biryani Specials', 'A collection of our best Biryani dishes.');


INSERT INTO menu_items (menu_id, name, description, price, calories)
VALUES
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Chilli Basil Noodles', 'Spicy noodles', 10.99, 800),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Pan Fried Thick Gravy Noodles', 'Fried noodles', 10.99, 950),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Hakka Noodles', 'People fav. noodles', 8.99, 950),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Manchurian Dry', 'Chinese soya sauce manchurian', 8.99, 950),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Veg Spring Roll', 'Rolls filled with vegetables', 9.99, 950),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Paneer Chilli Dry', 'Sauted Paneer and chilli with soya sauce', 9.99, 950),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Manchurian Noodles', 'Noodles with manchuurian', 9.99, 950),
((SELECT id FROM menus WHERE name = 'Chinese Specials'), 'Veg Fried Rice', 'Fried rice with vegetables', 10.99, 950),
((SELECT id FROM menus WHERE name = 'Sizzlers Specials'), 'Thai Sizzlers', 'Phad thai noodles, thai rice, vegetables', 8.99, 950),
((SELECT id FROM menus WHERE name = 'Sizzlers Specials'), 'Italian Sizzler', 'Pasta in pink-panther sauce', 9.99, 950),
((SELECT id FROM menus WHERE name = 'Sizzlers Specials'), 'Mexican Sizzler', 'Fajita veggies, mexican rice, stuffed tortillas', 10.99, 950),
((SELECT id FROM menus WHERE name = 'Sizzlers Specials'), 'Royal Sizzler', 'Rice/Noodles', 11.99, 950),
((SELECT id FROM menus WHERE name = 'Sizzlers Specials'), 'Indian Sizzler', 'Tawa pulao, chana gravy, Veg. cutlet & paneer tika', 12.99, 950),
((SELECT id FROM menus WHERE name = 'Sizzlers Specials'), 'Shanghai Platter', 'Schezwan noodles, manchurian with gravy, chinese fried', 13.99, 950),
((SELECT id FROM menus WHERE name = 'Salads Specials'), 'Roasted Corn Salad', 'Roasted corn, bell peppers, cheese, olives & mexican herbs', 8.99, 950),
((SELECT id FROM menus WHERE name = 'Salads Specials'), 'Caesar"s Salad', 'Lettuce, olives, garlic, dijon mustard', 9.99, 950),
((SELECT id FROM menus WHERE name = 'Salads Specials'), 'Macaroni Salad', 'Macaroni with carrots and corn on creamy dressing', 10.99, 950),
((SELECT id FROM menus WHERE name = 'Salads Specials'), 'Mexican Peanut Salad', 'Roasted peanuts, corn, bellpepper, tomatoes', 11.99, 950),
((SELECT id FROM menus WHERE name = 'Salads Specials'), 'Mexican Taco-Tart Salad', 'A must try... tartlets of refried beans salad', 12.99, 950),
((SELECT id FROM menus WHERE name = 'Biryani Specials'), 'Afghani Biryani', 'Afghani style biryani in brown masala', 11.99, 950),
((SELECT id FROM menus WHERE name = 'Biryani Specials'), 'Hyderabadi Biryani', 'Biryani cooked in green hyderabadi masalas', 12.99, 950),
((SELECT id FROM menus WHERE name = 'Biryani Specials'), 'Slow Cooked Biryani', 'Recipe from the royal houses of lucknow', 13.99, 950),
((SELECT id FROM menus WHERE name = 'Biryani Specials'), 'Bade-Miyan Ki Biryani', 'Mumbai bade-miyan style biryani', 14.99, 950);

***********************************************************************************************************************************************************

-> Change the settings of the DB in file config.js
-> Run the code using npm start


