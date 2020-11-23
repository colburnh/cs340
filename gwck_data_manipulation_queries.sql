-- add primary key to product list
ALTER TABLE updated_product_list ADD food_id INT AUTO_INCREMENT PRIMARY KEY FIRST

-- get all Products and related information for the Product list page
SELECT updated_product_list.brandName, updated_product_list.foodName, updated_product_list.foodType, updated_product_list.calPerUnit, updated_product_list.forSpecies AS brandName, foodName, foodType, calPerUnit, forSpecies FROM updated_product_list

-- get all first and last names of clients for client list
SELECT clients.fname, clients.lname FROM clients

-- add a new product
INSERT INTO updated_product_list (updated_product_list.brandName, updated_product_list.foodName, updated_product_list.foodType, updated_product_list.calPerUnit, updated_product_list.forSpecies) VALUES (:brandNameInput, :foodNameInput, :foodTypeInput, :calPerUnitInput, :forSpeciesInput)

-- delete a product
DELETE FROM updated_product_list WHERE food_id = :food_id_selected

-- search for a product by keyword
SELECT brandName, foodName, foodType, forSpecies FROM updated_product_list WHERE (foodName LIKE :userInput)



-- get all Pets for the Pet page
SELECT pets.petID, pets.petName, pets.species, pets.weight, pets.caloricGoal, pets.healthIssue, pets.percentCanned, pets.percentDry AS petID, petName, species, weight, caloricGoal, healthIssue, percentCanned, percentDry FROM pets

-- add a pet
INSERT INTO pets (pets.petName, pets.species, pets.weight, pets.caloricGoal, pets.healthIssue, pets.percentCanned, pets.percentDry) VALUES (:petNameInput, :speciesInput, :weightInput, :healthIssuesInput, :percentCannedInput, :percentDryInput)

-- delete a pet
DELETE FROM pets WHERE petId = :pet_id_selected

-- search for a pet by name
SELECT petID, petName, species, weight, caloricGoal, healthIssue, percentCanned, percentDry FROM pets WHERE (petName LIKE :userInput)



-- get all Clients for Client page
SELECT clients.clientID, clients.fname, clients.lname AS clientID, fname, lname FROM clients

-- add a client
INSERT INTO clients (clients.fname, clients.lname) VALUES (:fnameInput, lnameInput)

-- delete a Client
DELETE FROM clients WHERE clientId = :client_id_selected

-- search by a Client by first name
SELECT clientId, fname, lname FROM clients WHERE (fname LIKE :fnameInput)

-- update a Client entry
UPDATE clients SET fname = :fnameInput, lname = :lnameInput WHERE clientId = :client_id_selected

-- get all Clients with their Pets




-- get all HealthIssues for Health Issue page
SELECT healthIssues.healthIssue, healthIssues.species, healthIssues.recPercentCanned, healthIssues.recPercentDry AS healthIssue, species, recPercentCanned, recPercentDry from healthIssues

-- add a HealthIssue
INSERT INTO healthIssues (healthIssues.healthIssue, healthIssues.species, healthIssues.recPercentCanned, healthIssues.recPercentDry) VALUES (:healthIssueInput, :speciesInput, :recPercentCannedInput, :recPercentDryInput)

-- delete a HealthIssue
DELETE FROM healthIssues WHERE healthIssueId = :health_issue_id_selected

-- search by keyword
SELECT healthIssue, species, recPercentCanned, recPercentDry FROM healthIssues WHERE (healthIssue LIKE :healthIssueInput)

-- update a HealthIssue entry
UPDATE healthIssues SET healthIssue = :healthIssueInput, species = :speciesInput, recPercentCanned = :recPercentCannedInput, recPercentDry = :recPercentDryInput) WHERE healthIssue = :healthIssueSelected

