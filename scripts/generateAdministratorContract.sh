#!/usr/bin/env bash

echo $1;
echo $2;

sed "s/%noOfAuthorities%/$1/g;s/%shamirPolynomial%/$2/g" AdministratorSkeleton.sol > ../contracts/BVAdministrator.sol