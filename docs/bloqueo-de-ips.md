# Bloqueo de IPs

Las IPs bloqueadas **no van en el `.htaccess`**: este repositorio es público y
publicar la lista de bloqueo le dice al atacante exactamente qué direcciones
tiene quemadas.

Tampoco se pueden externalizar a un archivo aparte: `Include` es una directiva
de configuración de servidor y Apache **no la permite dentro de un `.htaccess`**.

Por eso el bloqueo vive en el cortafuegos, que además es mejor: actúa antes de
que Apache procese la petición y cubre todos los puertos, no solo el 80 y el 443.

## Cómo bloquear una IP

```bash
sudo iptables -I INPUT 1 -s <IP> -j DROP
sudo netfilter-persistent save
```

`netfilter-persistent` está habilitado, así que la regla sobrevive al reinicio
y queda guardada en `/etc/iptables/rules.v4` (root, fuera del repo).

## Cómo ver o quitar

```bash
sudo iptables -L INPUT -n --line-numbers | head -20   # ver
sudo iptables -D INPUT -s <IP> -j DROP                # quitar
sudo netfilter-persistent save                        # guardar el cambio
```

## Qué hay hoy

Tres IPs de los ataques de agosto de 2026, movidas desde el `.htaccess` el
2026-09-12. La versión anterior del archivo, con las IPs, quedó respaldada en
`~/backups/web-20260912-072243/htaccess-con-ips`.

`fail2ban` sigue corriendo aparte con cuatro jaulas (sshd y tres de Apache),
pero sus baneos **expiran en un día** (`dbpurgeage = 1d`): sirve para ataques
en curso, no para una lista permanente.
