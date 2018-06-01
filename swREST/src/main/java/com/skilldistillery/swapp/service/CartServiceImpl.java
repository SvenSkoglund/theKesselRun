package com.skilldistillery.swapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.swapp.Cart;
import com.skilldistillery.swapp.repository.CartRepo;
import com.skilldistillery.swapp.repository.ProfileRepo;

@Service
public class CartServiceImpl implements CartService {
	
	@Autowired
	private CartRepo cartRepo;
	@Autowired
	private ProfileRepo profileRepo;
	
	@Override
	public List<Cart> index() {
		return cartRepo.findAll();
	}

	@Override
	public Cart show(Integer id) {
		return profileRepo.findById(id).get().getCart();
	}

	@Override
	public Cart update(int id, Cart cart) {
		Cart managedCart = cartRepo.findById(id).get();
		managedCart.setItems(cart.getItems());
		return cartRepo.saveAndFlush(managedCart);
	}


}
