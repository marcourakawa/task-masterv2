from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ['id', 'first_name', 'email', 'password']

        def validate_email(self, value):
            email = value.strip().lower()

            if User.objects.filter(email_iexact=email).exists():
                raise serializers.ValidationError(
                    "Este e-mail já está cadastrado."
                )

            return email

        def create(self, validated_data):
            email = validated_data.pop('email')

            user = User.objects.create_user(
                username=email,
                email=email,
                **validated_data
            )

            return user