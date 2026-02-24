package com.commerce.domain.user;

import com.commerce.common.exception.BusinessException;
import com.commerce.domain.user.exception.UserErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity createUser(String email, String rawPassword, String name, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(UserErrorCode.DUPLICATE_EMAIL);
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        UserEntity user = UserEntity.create(email, encodedPassword, name, phone);
        return userRepository.save(user);
    }

    public UserEntity findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public boolean verifyPassword(UserEntity user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    @Transactional
    public void updateProfile(Long userId, String name, String phone) {
        UserEntity user = findById(userId);
        user.updateProfile(name, phone);
    }

    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        UserEntity user = findById(userId);
        if (!verifyPassword(user, oldPassword)) {
            throw new BusinessException(UserErrorCode.INVALID_PASSWORD);
        }
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.updatePassword(encodedPassword);
    }
}
