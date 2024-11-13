FROM ubuntu:22.04

WORKDIR /docs

RUN <<EOF
echo "echo 'hello world!'" >> hello_world.sh
chmod +x hello_world.sh
EOF

CMD ["bash", "hello_world.sh"]



