package com.commerce.domain.cart;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCartEntity is a Querydsl query type for CartEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCartEntity extends EntityPathBase<CartEntity> {

    private static final long serialVersionUID = 581155245L;

    public static final QCartEntity cartEntity = new QCartEntity("cartEntity");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final ListPath<CartItemEntity, QCartItemEntity> items = this.<CartItemEntity, QCartItemEntity>createList("items", CartItemEntity.class, QCartItemEntity.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QCartEntity(String variable) {
        super(CartEntity.class, forVariable(variable));
    }

    public QCartEntity(Path<? extends CartEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCartEntity(PathMetadata metadata) {
        super(CartEntity.class, metadata);
    }

}

