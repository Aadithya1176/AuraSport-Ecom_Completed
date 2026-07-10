from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth import admin_required, create_access_token, get_current_user, hash_password, verify_password
from ..database import get_db
from ..models import Users
from ..schemas import ErrorResponse, LoginResponse, UserCreate, UserLogin, UserProfileUpdate, UserResponse


user_router = APIRouter(prefix="", tags=["Users"])


@user_router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a standard customer account. New registrations always receive the `user` role.",
    responses={400: {"model": ErrorResponse}},
)
def register_user(user: UserCreate, db: Session = Depends(get_db)) -> Users:
    new_user = Users(
        username=user.username.strip(),
        email=user.email,
        password=hash_password(user.password),
        role="user",
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists") from exc

    return new_user


@user_router.post(
    "/login",
    response_model=LoginResponse,
    summary="Authenticate a user",
    description="Return a JWT bearer token for a valid email and password combination.",
    responses={401: {"model": ErrorResponse}},
)
def login_user(user: UserLogin, db: Session = Depends(get_db)) -> LoginResponse:
    existing_user = db.query(Users).filter(Users.email == user.email).first()

    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": existing_user.email, "role": existing_user.role})
    return LoginResponse(access_token=token, user=existing_user)


@user_router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Return the authenticated user represented by the bearer token.",
    responses={401: {"model": ErrorResponse}},
)
def get_me(current_user: Users = Depends(get_current_user)) -> Users:
    return current_user


@user_router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
    description="Save profile and delivery details for the authenticated user.",
    responses={401: {"model": ErrorResponse}},
)
def update_me(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
) -> Users:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value.strip() if isinstance(value, str) else value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@user_router.get(
    "/users",
    response_model=list[UserResponse],
    summary="List users",
    description="Admin-only endpoint to inspect registered users.",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)
def get_users(_: Users = Depends(admin_required), db: Session = Depends(get_db)) -> list[Users]:
    return db.query(Users).order_by(Users.id.asc()).all()
